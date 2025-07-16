# AIMS 部署指南

本文档详细介绍了AIMS系统的部署流程和配置方法。

## 🚀 快速部署

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: 最新版本

### 本地开发部署

1. **克隆项目**
```bash
git clone https://github.com/solihe/aims.git
cd aims
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**
- 开发服务器: `http://localhost:5173`
- 网络访问: `http://[your-ip]:5173`

## 🏗️ 生产环境部署

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建完成后，`dist/` 目录包含所有生产文件。

### 静态文件服务器部署

#### 使用 Nginx

1. **安装 Nginx**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **配置 Nginx**
```nginx
# /etc/nginx/sites-available/aims
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/aims/dist;
    index index.html;

    # 处理单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

3. **启用站点**
```bash
sudo ln -s /etc/nginx/sites-available/aims /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 使用 Apache

1. **配置 Apache**
```apache
# /etc/apache2/sites-available/aims.conf
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/aims/dist
    
    <Directory /path/to/aims/dist>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
    
    # 单页应用路由支持
    FallbackResource /index.html
    
    # 静态资源缓存
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

2. **启用站点**
```bash
sudo a2ensite aims.conf
sudo a2enmod rewrite expires
sudo systemctl reload apache2
```

### Docker 部署

1. **创建 Dockerfile**
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产镜像
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **创建 nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

3. **构建和运行**
```bash
# 构建镜像
docker build -t aims:latest .

# 运行容器
docker run -d -p 80:80 --name aims-app aims:latest
```

### Docker Compose 部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  aims:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx
```

运行命令：
```bash
docker-compose up -d
```

## ☁️ 云平台部署

### Vercel 部署

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **部署**
```bash
vercel --prod
```

3. **配置文件** (vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify 部署

1. **创建 _redirects 文件**
```
# public/_redirects
/*    /index.html   200
```

2. **部署配置** (netlify.toml)
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages 部署

1. **安装 gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **添加部署脚本** (package.json)
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **部署**
```bash
npm run deploy
```

## 🔧 环境配置

### 环境变量

创建 `.env` 文件：
```env
# API配置
VITE_API_BASE_URL=https://api.your-domain.com
VITE_API_TIMEOUT=10000

# LLM配置
VITE_DEFAULT_LLM_PROVIDER=openai
VITE_ENABLE_MOCK_DATA=false

# 功能开关
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true

# 调试配置
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

### 生产环境优化

1. **性能优化**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          store: ['zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

2. **CDN配置**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

## 🔒 安全配置

### HTTPS 配置

1. **获取 SSL 证书**
```bash
# 使用 Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

2. **Nginx HTTPS 配置**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # 安全头部
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    root /path/to/aims/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 内容安全策略 (CSP)

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.your-domain.com;
">
```

## 📊 监控和日志

### 应用监控

1. **错误监控**
```javascript
// 集成 Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

2. **性能监控**
```javascript
// 集成 Google Analytics
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID');
```

### 服务器监控

1. **Nginx 日志配置**
```nginx
access_log /var/log/nginx/aims_access.log;
error_log /var/log/nginx/aims_error.log;
```

2. **日志轮转**
```bash
# /etc/logrotate.d/aims
/var/log/nginx/aims_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

## 🔄 CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy AIMS

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run test
    - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/master'
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to production
      run: |
        # 部署脚本
        echo "Deploying to production..."
```

## 🆘 故障排除

### 常见问题

1. **路由问题**
   - 确保服务器配置了单页应用路由支持
   - 检查 `try_files` 或 `FallbackResource` 配置

2. **静态资源加载失败**
   - 检查资源路径配置
   - 确认 MIME 类型设置正确

3. **API 请求失败**
   - 检查 CORS 配置
   - 确认 API 端点可访问

### 性能问题

1. **首屏加载慢**
   - 启用 Gzip 压缩
   - 配置静态资源缓存
   - 使用 CDN 加速

2. **内存占用高**
   - 检查内存泄漏
   - 优化组件渲染
   - 使用代码分割

---

<div align="center">

**[⬆ 回到顶部](#aims-部署指南)**

如有部署问题，请查看 [GitHub Issues](https://github.com/solihe/aims/issues)

</div>
