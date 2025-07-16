# AIMS 部署运维指南

## 🏗️ 部署架构

### 1. 整体部署架构

```mermaid
graph TB
    subgraph "负载均衡层"
        LB[Nginx Load Balancer]
        CDN[CDN]
    end
    
    subgraph "应用层"
        FE1[Frontend Instance 1]
        FE2[Frontend Instance 2]
        API1[API Gateway 1]
        API2[API Gateway 2]
        AS1[Agent Service 1]
        AS2[Agent Service 2]
        CS1[Content Service 1]
        CS2[Content Service 2]
        LS[LLM Service]
    end
    
    subgraph "数据层"
        PG[(PostgreSQL Cluster)]
        MG[(MongoDB Cluster)]
        RD[(Redis Cluster)]
    end
    
    subgraph "监控层"
        PROM[Prometheus]
        GRAF[Grafana]
        JAEG[Jaeger]
        ELK[ELK Stack]
    end
    
    CDN --> LB
    LB --> FE1
    LB --> FE2
    LB --> API1
    LB --> API2
    
    API1 --> AS1
    API1 --> CS1
    API2 --> AS2
    API2 --> CS2
    
    AS1 --> LS
    AS2 --> LS
    CS1 --> LS
    CS2 --> LS
    
    AS1 --> PG
    AS2 --> PG
    CS1 --> MG
    CS2 --> MG
    
    AS1 --> RD
    AS2 --> RD
    CS1 --> RD
    CS2 --> RD
    
    PROM --> AS1
    PROM --> AS2
    PROM --> CS1
    PROM --> CS2
```

### 2. 环境规划

#### 环境分层
| 环境 | 用途 | 配置 | 数据 |
|-----|------|------|------|
| 开发环境 | 日常开发测试 | 单机部署 | 模拟数据 |
| 测试环境 | 集成测试 | 小规模集群 | 测试数据 |
| 预发布环境 | 生产验证 | 生产同等配置 | 脱敏生产数据 |
| 生产环境 | 正式服务 | 高可用集群 | 真实数据 |

#### 资源配置

**开发环境**
```yaml
resources:
  frontend:
    cpu: 0.5 cores
    memory: 1GB
    storage: 10GB
  backend:
    cpu: 1 core
    memory: 2GB
    storage: 20GB
  database:
    cpu: 1 core
    memory: 2GB
    storage: 50GB
```

**生产环境**
```yaml
resources:
  frontend:
    replicas: 3
    cpu: 2 cores
    memory: 4GB
    storage: 20GB
  backend:
    replicas: 5
    cpu: 4 cores
    memory: 8GB
    storage: 50GB
  database:
    replicas: 3
    cpu: 8 cores
    memory: 32GB
    storage: 500GB
```

## 🐳 容器化部署

### 1. Docker配置

#### 前端Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 后端Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

#### Docker Compose配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/aims
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aims
      - POSTGRES_USER=aims_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  mongodb:
    image: mongo:7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secure_password
      - MONGO_INITDB_DATABASE=aims
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  mongodb_data:
```

### 2. Kubernetes部署

#### 命名空间配置
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aims-production
  labels:
    name: aims-production
    environment: production
```

#### ConfigMap配置
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aims-config
  namespace: aims-production
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  API_BASE_URL: "https://api.aims.example.com"
  FRONTEND_URL: "https://aims.example.com"
  
---
apiVersion: v1
kind: Secret
metadata:
  name: aims-secrets
  namespace: aims-production
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@postgres:5432/aims"
  REDIS_URL: "redis://redis:6379"
  JWT_SECRET: "your-super-secret-jwt-key"
  OPENAI_API_KEY: "your-openai-api-key"
  CLAUDE_API_KEY: "your-claude-api-key"
```

#### 前端部署
```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aims-frontend
  namespace: aims-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aims-frontend
  template:
    metadata:
      labels:
        app: aims-frontend
    spec:
      containers:
      - name: frontend
        image: aims/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: aims-frontend-service
  namespace: aims-production
spec:
  selector:
    app: aims-frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

#### 后端部署
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aims-backend
  namespace: aims-production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: aims-backend
  template:
    metadata:
      labels:
        app: aims-backend
    spec:
      containers:
      - name: backend
        image: aims/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: aims-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: aims-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: aims-secrets
              key: REDIS_URL
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2
            memory: 4Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: aims-backend-service
  namespace: aims-production
spec:
  selector:
    app: aims-backend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

#### Ingress配置
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aims-ingress
  namespace: aims-production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - aims.example.com
    - api.aims.example.com
    secretName: aims-tls
  rules:
  - host: aims.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: aims-frontend-service
            port:
              number: 80
  - host: api.aims.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: aims-backend-service
            port:
              number: 3000
```

## 🗄️ 数据库部署

### 1. PostgreSQL集群

#### 主从复制配置
```yaml
# k8s/postgres-primary.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-primary
  namespace: aims-production
spec:
  serviceName: postgres-primary
  replicas: 1
  selector:
    matchLabels:
      app: postgres-primary
  template:
    metadata:
      labels:
        app: postgres-primary
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: aims
        - name: POSTGRES_USER
          value: aims_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: POSTGRES_REPLICATION_USER
          value: replicator
        - name: POSTGRES_REPLICATION_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: replication-password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        - name: postgres-config
          mountPath: /etc/postgresql/postgresql.conf
          subPath: postgresql.conf
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
```

#### 备份策略
```bash
#!/bin/bash
# scripts/backup-postgres.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="aims_backup_${DATE}.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
pg_dump -h postgres-primary -U aims_user -d aims > $BACKUP_DIR/$BACKUP_FILE

# 压缩备份文件
gzip $BACKUP_DIR/$BACKUP_FILE

# 上传到对象存储
aws s3 cp $BACKUP_DIR/$BACKUP_FILE.gz s3://aims-backups/postgres/

# 清理本地文件（保留7天）
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### 2. MongoDB集群

#### 副本集配置
```yaml
# k8s/mongodb-replica.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb-replica
  namespace: aims-production
spec:
  serviceName: mongodb-replica
  replicas: 3
  selector:
    matchLabels:
      app: mongodb-replica
  template:
    metadata:
      labels:
        app: mongodb-replica
    spec:
      containers:
      - name: mongodb
        image: mongo:7
        command:
        - mongod
        - --replSet
        - rs0
        - --bind_ip_all
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: admin
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2
            memory: 4Gi
  volumeClaimTemplates:
  - metadata:
      name: mongodb-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 50Gi
```

### 3. Redis集群

#### 哨兵模式配置
```yaml
# k8s/redis-sentinel.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-sentinel
  namespace: aims-production
spec:
  serviceName: redis-sentinel
  replicas: 3
  selector:
    matchLabels:
      app: redis-sentinel
  template:
    metadata:
      labels:
        app: redis-sentinel
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command:
        - redis-server
        - /etc/redis/redis.conf
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-config
          mountPath: /etc/redis
        - name: redis-data
          mountPath: /data
      - name: sentinel
        image: redis:7-alpine
        command:
        - redis-sentinel
        - /etc/redis/sentinel.conf
        ports:
        - containerPort: 26379
        volumeMounts:
        - name: sentinel-config
          mountPath: /etc/redis
      volumes:
      - name: redis-config
        configMap:
          name: redis-config
      - name: sentinel-config
        configMap:
          name: sentinel-config
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## 📊 监控告警

### 1. Prometheus监控

#### 监控配置
```yaml
# k8s/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: aims-production
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s

    rule_files:
      - "/etc/prometheus/rules/*.yml"

    alerting:
      alertmanagers:
        - static_configs:
            - targets:
              - alertmanager:9093

    scrape_configs:
      - job_name: 'aims-backend'
        static_configs:
          - targets: ['aims-backend-service:3000']
        metrics_path: /metrics
        scrape_interval: 30s

      - job_name: 'postgres'
        static_configs:
          - targets: ['postgres-exporter:9187']

      - job_name: 'redis'
        static_configs:
          - targets: ['redis-exporter:9121']

      - job_name: 'mongodb'
        static_configs:
          - targets: ['mongodb-exporter:9216']

      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
```

#### 告警规则
```yaml
# k8s/alert-rules.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-rules
  namespace: aims-production
data:
  aims-alerts.yml: |
    groups:
      - name: aims-alerts
        rules:
          - alert: ServiceDown
            expr: up == 0
            for: 1m
            labels:
              severity: critical
            annotations:
              summary: "Service {{ $labels.job }} is down"
              description: "Service {{ $labels.job }} has been down for more than 1 minute"

          - alert: HighErrorRate
            expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
            for: 2m
            labels:
              severity: warning
            annotations:
              summary: "High error rate detected"
              description: "Error rate is {{ $value }} errors per second"

          - alert: HighMemoryUsage
            expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "High memory usage"
              description: "Memory usage is above 90%"

          - alert: DatabaseConnectionsHigh
            expr: pg_stat_database_numbackends > 80
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "High database connections"
              description: "Database has {{ $value }} active connections"

          - alert: LLMCostSpike
            expr: increase(llm_cost_total[1h]) > 100
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "LLM costs are spiking"
              description: "LLM costs increased by ${{ $value }} in the last hour"
```

### 2. Grafana仪表板

#### 系统概览仪表板
```json
{
  "dashboard": {
    "title": "AIMS System Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{ method }} {{ status }}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Active Agents",
        "type": "stat",
        "targets": [
          {
            "expr": "aims_active_agents_total",
            "legendFormat": "Active Agents"
          }
        ]
      },
      {
        "title": "Content Generated",
        "type": "stat",
        "targets": [
          {
            "expr": "increase(aims_content_generated_total[24h])",
            "legendFormat": "Last 24h"
          }
        ]
      }
    ]
  }
}
```

## 🚨 故障处理

### 1. 常见故障排查

#### 服务不可用排查流程
```mermaid
graph TD
    A[服务不可用] --> B{检查Pod状态}
    B -->|Running| C{检查健康检查}
    B -->|CrashLoopBackOff| D[查看Pod日志]
    B -->|Pending| E[检查资源限制]

    C -->|失败| F[检查应用日志]
    C -->|成功| G{检查网络连接}

    D --> H[修复应用错误]
    E --> I[调整资源配额]

    F --> J[修复应用问题]
    G -->|失败| K[检查网络策略]
    G -->|成功| L[检查上游服务]

    K --> M[调整网络配置]
    L --> N[检查依赖服务]
```

#### 数据库故障排查
```bash
#!/bin/bash
# scripts/db-health-check.sh

echo "Checking PostgreSQL health..."
pg_isready -h postgres-primary -U aims_user

if [ $? -ne 0 ]; then
  echo "PostgreSQL is not responding. Checking details..."

  # 检查连接数
  echo "Current connections:"
  psql -h postgres-primary -U aims_user -c "SELECT count(*) FROM pg_stat_activity;"

  # 检查锁
  echo "Checking locks:"
  psql -h postgres-primary -U aims_user -c "SELECT relation::regclass, mode, pid, granted FROM pg_locks l JOIN pg_stat_activity a ON l.pid = a.pid WHERE relation IS NOT NULL ORDER BY relation;"

  # 检查长时间运行的查询
  echo "Long running queries:"
  psql -h postgres-primary -U aims_user -c "SELECT pid, now() - query_start AS duration, query FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > '30 seconds'::interval ORDER BY duration DESC;"
fi

echo "Checking MongoDB health..."
mongo --host mongodb-replica-0 --eval "db.adminCommand('ping')"

echo "Checking Redis health..."
redis-cli -h redis-sentinel ping
```

### 2. 灾难恢复

#### 数据库恢复流程
```bash
#!/bin/bash
# scripts/restore-postgres.sh

if [ $# -ne 1 ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

BACKUP_FILE=$1

echo "Restoring PostgreSQL database from $BACKUP_FILE..."

# 解压备份文件
gunzip -c $BACKUP_FILE > /tmp/restore.sql

# 停止应用服务
kubectl scale deployment aims-backend --replicas=0 -n aims-production

# 恢复数据库
psql -h postgres-primary -U aims_user -d aims < /tmp/restore.sql

# 清理临时文件
rm /tmp/restore.sql

# 重启应用服务
kubectl scale deployment aims-backend --replicas=5 -n aims-production

echo "Database restore completed."
```

#### 系统恢复计划
```markdown
# AIMS系统灾难恢复计划

## 1. 灾难类型
- 数据中心故障
- 数据库损坏
- 应用程序故障
- 安全漏洞/攻击

## 2. 恢复目标
- RPO (Recovery Point Objective): 15分钟
- RTO (Recovery Time Objective): 1小时

## 3. 恢复步骤

### 数据中心故障
1. 激活备用区域的Kubernetes集群
2. 确认最新数据库备份可用
3. 在备用区域恢复数据库
4. 部署应用服务
5. 更新DNS记录指向新环境
6. 验证系统功能

### 数据库损坏
1. 停止所有应用服务
2. 从最近的备份恢复数据库
3. 验证数据完整性
4. 重启应用服务
5. 监控系统性能和错误率

### 应用程序故障
1. 回滚到上一个稳定版本
2. 重启应用服务
3. 验证系统功能
4. 分析故障原因
5. 修复问题并部署修复版本

### 安全漏洞/攻击
1. 隔离受影响的系统
2. 评估损害范围
3. 修复安全漏洞
4. 从干净的备份恢复数据
5. 增强安全措施
6. 重新部署系统
```

## 🔄 持续集成/部署

### 1. CI/CD流水线

#### GitHub Actions工作流
```yaml
# .github/workflows/ci-cd.yaml
name: AIMS CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  release:
    types: [ published ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run tests
      run: npm run test

    - name: Run security audit
      run: npm audit --audit-level high

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' || github.event_name == 'release'
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Build Docker image
      run: |
        docker build -t aims/frontend:${{ github.sha }} ./frontend
        docker build -t aims/backend:${{ github.sha }} ./backend

    - name: Push Docker images
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push aims/frontend:${{ github.sha }}
        docker push aims/backend:${{ github.sha }}

        if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
          docker tag aims/frontend:${{ github.sha }} aims/frontend:latest
          docker tag aims/backend:${{ github.sha }} aims/backend:latest
          docker push aims/frontend:latest
          docker push aims/backend:latest
        fi

        if [[ "${{ github.event_name }}" == "release" ]]; then
          docker tag aims/frontend:${{ github.sha }} aims/frontend:${{ github.event.release.tag_name }}
          docker tag aims/backend:${{ github.sha }} aims/backend:${{ github.event.release.tag_name }}
          docker push aims/frontend:${{ github.event.release.tag_name }}
          docker push aims/backend:${{ github.event.release.tag_name }}
        fi

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - uses: actions/checkout@v4

    - name: Setup Kubernetes CLI
      uses: azure/setup-kubectl@v3

    - name: Setup Kubernetes config
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" > kubeconfig
        export KUBECONFIG=./kubeconfig

    - name: Deploy to staging
      run: |
        kubectl set image deployment/aims-frontend aims-frontend=aims/frontend:${{ github.sha }} -n aims-staging
        kubectl set image deployment/aims-backend aims-backend=aims/backend:${{ github.sha }} -n aims-staging
        kubectl rollout status deployment/aims-frontend -n aims-staging
        kubectl rollout status deployment/aims-backend -n aims-staging

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: production
    steps:
    - uses: actions/checkout@v4

    - name: Setup Kubernetes CLI
      uses: azure/setup-kubectl@v3

    - name: Setup Kubernetes config
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" > kubeconfig
        export KUBECONFIG=./kubeconfig

    - name: Deploy to production
      run: |
        kubectl set image deployment/aims-frontend aims-frontend=aims/frontend:${{ github.event.release.tag_name }} -n aims-production
        kubectl set image deployment/aims-backend aims-backend=aims/backend:${{ github.event.release.tag_name }} -n aims-production
        kubectl rollout status deployment/aims-frontend -n aims-production
        kubectl rollout status deployment/aims-backend -n aims-production
```
```
