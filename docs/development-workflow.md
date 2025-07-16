# AIMS 开发流程规范

## 🌊 Git工作流

### 1. 分支策略 (Git Flow)

```
main (生产分支)
├── develop (开发主分支)
│   ├── feature/agent-collaboration (功能分支)
│   ├── feature/llm-integration (功能分支)
│   └── feature/content-generation (功能分支)
├── release/v1.0.0 (发布分支)
├── hotfix/critical-bug-fix (热修复分支)
└── support/v0.9.x (支持分支)
```

#### 分支类型说明

| 分支类型 | 命名规范 | 生命周期 | 用途 |
|---------|---------|---------|------|
| `main` | main | 永久 | 生产环境代码，只接受合并 |
| `develop` | develop | 永久 | 开发主分支，集成所有功能 |
| `feature/*` | feature/功能名称 | 临时 | 新功能开发 |
| `release/*` | release/版本号 | 临时 | 版本发布准备 |
| `hotfix/*` | hotfix/问题描述 | 临时 | 紧急问题修复 |
| `support/*` | support/版本号 | 长期 | 旧版本维护支持 |

#### 分支命名规范
```bash
# 功能分支
feature/agent-collaboration
feature/llm-provider-integration
feature/content-review-system

# 发布分支
release/v1.0.0
release/v1.1.0-beta

# 热修复分支
hotfix/agent-crash-fix
hotfix/security-vulnerability

# 支持分支
support/v0.9.x
support/v1.0.x
```

### 2. 提交规范 (Conventional Commits)

#### 提交消息格式
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### 提交类型
| 类型 | 描述 | 示例 |
|-----|------|------|
| `feat` | 新功能 | `feat(agent): add collaboration mechanism` |
| `fix` | Bug修复 | `fix(llm): resolve API timeout issue` |
| `docs` | 文档更新 | `docs(api): update agent configuration guide` |
| `style` | 代码格式 | `style(components): fix eslint warnings` |
| `refactor` | 重构 | `refactor(services): extract common LLM logic` |
| `perf` | 性能优化 | `perf(content): optimize generation speed` |
| `test` | 测试相关 | `test(agent): add unit tests for CMO agent` |
| `chore` | 构建/工具 | `chore(deps): update dependencies` |
| `ci` | CI/CD | `ci(github): add automated testing workflow` |
| `revert` | 回滚 | `revert: feat(agent): add collaboration mechanism` |

#### 提交示例
```bash
# 新功能
git commit -m "feat(agent): implement ReAct pattern for CMO agent

- Add thought-action-observation loop
- Integrate with LLM service for decision making
- Support dynamic strategy adjustment

Closes #123"

# Bug修复
git commit -m "fix(llm): handle API rate limiting

- Add exponential backoff retry mechanism
- Implement fallback to secondary provider
- Log rate limit events for monitoring

Fixes #456"

# 重大变更
git commit -m "feat(api): redesign agent configuration API

BREAKING CHANGE: Agent configuration format has changed.
Migration guide available in docs/migration.md

- Simplify configuration structure
- Add validation schemas
- Improve error messages"
```

### 3. 分支操作流程

#### 功能开发流程
```bash
# 1. 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/agent-collaboration

# 2. 开发功能
git add .
git commit -m "feat(agent): implement basic collaboration framework"

# 3. 定期同步develop分支
git checkout develop
git pull origin develop
git checkout feature/agent-collaboration
git rebase develop

# 4. 推送功能分支
git push origin feature/agent-collaboration

# 5. 创建Pull Request
# 通过GitHub/GitLab界面创建PR

# 6. 代码审查通过后合并
# 删除本地功能分支
git checkout develop
git pull origin develop
git branch -d feature/agent-collaboration
```

#### 发布流程
```bash
# 1. 从develop创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. 版本号更新和最后调整
npm version 1.0.0
git commit -m "chore(release): bump version to 1.0.0"

# 3. 测试和bug修复
git commit -m "fix(release): resolve integration test failures"

# 4. 合并到main和develop
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

git checkout develop
git merge --no-ff release/v1.0.0

# 5. 推送所有更改
git push origin main
git push origin develop
git push origin v1.0.0

# 6. 删除发布分支
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

#### 热修复流程
```bash
# 1. 从main创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. 修复问题
git commit -m "fix(security): patch XSS vulnerability in content display"

# 3. 更新版本号
npm version patch
git commit -m "chore(hotfix): bump version to 1.0.1"

# 4. 合并到main和develop
git checkout main
git merge --no-ff hotfix/critical-security-fix
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

git checkout develop
git merge --no-ff hotfix/critical-security-fix

# 5. 推送更改
git push origin main
git push origin develop
git push origin v1.0.1

# 6. 删除热修复分支
git branch -d hotfix/critical-security-fix
```

## 🔄 CI/CD流程

### 1. GitHub Actions工作流

#### 主工作流配置
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

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
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, build, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # 部署脚本

  deploy-production:
    needs: [test, build, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment"
        # 部署脚本
```

#### E2E测试工作流
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点运行
  workflow_dispatch:     # 手动触发

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Start application
      run: |
        npm run build
        npm run preview &
        sleep 10
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

### 2. 质量门禁

#### 代码质量检查
```yaml
# .github/workflows/quality.yml
name: Code Quality

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0  # SonarCloud需要完整历史
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests with coverage
      run: npm run test:coverage
    
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    
    - name: Quality Gate Check
      run: |
        # 检查质量门禁状态
        curl -u ${{ secrets.SONAR_TOKEN }}: \
          "https://sonarcloud.io/api/qualitygates/project_status?projectKey=aims-project" \
          | jq -e '.projectStatus.status == "OK"'
```

### 3. 自动化部署

#### 部署脚本
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
    echo "Usage: $0 <environment> <version>"
    echo "Example: $0 staging v1.0.0"
    exit 1
fi

echo "Deploying AIMS $VERSION to $ENVIRONMENT environment..."

# 1. 构建Docker镜像
docker build -t aims:$VERSION .
docker tag aims:$VERSION aims:$ENVIRONMENT-latest

# 2. 推送到镜像仓库
docker push aims:$VERSION
docker push aims:$ENVIRONMENT-latest

# 3. 更新Kubernetes部署
kubectl set image deployment/aims-frontend aims-frontend=aims:$VERSION -n $ENVIRONMENT
kubectl set image deployment/aims-backend aims-backend=aims:$VERSION -n $ENVIRONMENT

# 4. 等待部署完成
kubectl rollout status deployment/aims-frontend -n $ENVIRONMENT
kubectl rollout status deployment/aims-backend -n $ENVIRONMENT

# 5. 运行健康检查
./scripts/health-check.sh $ENVIRONMENT

echo "Deployment completed successfully!"
```

#### 健康检查脚本
```bash
#!/bin/bash
# scripts/health-check.sh

ENVIRONMENT=$1
BASE_URL="https://aims-$ENVIRONMENT.example.com"

echo "Running health checks for $ENVIRONMENT environment..."

# 1. 基础健康检查
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
if [ $response -ne 200 ]; then
    echo "Health check failed: HTTP $response"
    exit 1
fi

# 2. API端点检查
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/health)
if [ $response -ne 200 ]; then
    echo "API health check failed: HTTP $response"
    exit 1
fi

# 3. 数据库连接检查
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/health/database)
if [ $response -ne 200 ]; then
    echo "Database health check failed: HTTP $response"
    exit 1
fi

# 4. 外部服务检查
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/health/external)
if [ $response -ne 200 ]; then
    echo "External services health check failed: HTTP $response"
    exit 1
fi

echo "All health checks passed!"
```

## 📋 代码审查流程

### 1. Pull Request模板

```markdown
<!-- .github/pull_request_template.md -->
## 📝 变更描述
简要描述本次变更的内容和目的

## 🔄 变更类型
- [ ] 新功能 (feature)
- [ ] Bug修复 (fix)
- [ ] 重构 (refactor)
- [ ] 文档更新 (docs)
- [ ] 性能优化 (perf)
- [ ] 测试相关 (test)
- [ ] 构建/工具 (chore)

## 🧪 测试情况
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] E2E测试通过
- [ ] 手动测试完成
- [ ] 性能测试通过

## 📊 质量检查
- [ ] 代码符合规范
- [ ] 测试覆盖率达标
- [ ] 文档已更新
- [ ] 无安全漏洞
- [ ] 性能无回归

## 🔗 相关链接
- 相关Issue: #
- 设计文档: 
- 测试报告: 

## 📸 截图/演示
如果是UI变更，请提供截图或演示视频

## 🔍 审查要点
请重点关注以下方面：
- 
- 

## ⚠️ 注意事项
- [ ] 包含破坏性变更
- [ ] 需要数据库迁移
- [ ] 需要配置更新
- [ ] 需要文档更新

## 📋 部署清单
- [ ] 环境变量配置
- [ ] 数据库迁移脚本
- [ ] 配置文件更新
- [ ] 依赖项安装
```

### 2. 审查清单

#### 功能性审查
- [ ] 代码实现符合需求规格
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 用户体验良好

#### 代码质量审查
- [ ] 代码结构清晰
- [ ] 命名规范一致
- [ ] 注释充分准确
- [ ] 无重复代码

#### 性能审查
- [ ] 算法效率合理
- [ ] 内存使用优化
- [ ] 数据库查询优化
- [ ] 缓存策略合理

#### 安全审查
- [ ] 输入验证完整
- [ ] 权限控制正确
- [ ] 敏感信息保护
- [ ] SQL注入防护

#### 测试审查
- [ ] 测试用例充分
- [ ] 测试覆盖率达标
- [ ] 边界测试完整
- [ ] 错误场景测试

### 3. 审查工具配置

#### GitHub分支保护规则
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "ci/test",
      "ci/build",
      "ci/security",
      "sonarcloud"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 2,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null
}
```

#### CODEOWNERS文件
```
# .github/CODEOWNERS

# 全局代码所有者
* @tech-lead @senior-dev

# 前端代码
/src/components/ @frontend-team
/src/styles/ @frontend-team @ui-designer

# 后端代码
/backend/ @backend-team
/backend/src/services/ @backend-team @ai-engineer

# Agent相关代码
/src/services/agent/ @ai-engineer @tech-lead
/backend/src/services/agent/ @ai-engineer @tech-lead

# 配置文件
*.config.* @devops-team
/scripts/ @devops-team
/.github/ @devops-team

# 文档
/docs/ @tech-writer @tech-lead
README.md @tech-lead
```

## 🚀 发布管理

### 1. 版本发布流程

#### 发布准备
```bash
# 1. 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. 更新版本号
npm version 1.1.0 --no-git-tag-version

# 3. 更新CHANGELOG
echo "## [1.1.0] - $(date +%Y-%m-%d)" >> CHANGELOG.md
echo "### Added" >> CHANGELOG.md
echo "- Agent collaboration mechanism" >> CHANGELOG.md
echo "- Enhanced LLM provider support" >> CHANGELOG.md

# 4. 提交版本更新
git add .
git commit -m "chore(release): prepare version 1.1.0"
```

#### 发布执行
```bash
# 1. 合并到main分支
git checkout main
git merge --no-ff release/v1.1.0

# 2. 创建标签
git tag -a v1.1.0 -m "Release version 1.1.0

Features:
- Agent collaboration mechanism
- Enhanced LLM provider support
- Improved content generation quality

Bug Fixes:
- Fixed memory leak in agent manager
- Resolved API timeout issues

Breaking Changes:
- Agent configuration format updated"

# 3. 合并回develop分支
git checkout develop
git merge --no-ff release/v1.1.0

# 4. 推送所有更改
git push origin main
git push origin develop
git push origin v1.1.0

# 5. 清理发布分支
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

### 2. 自动化发布

#### 发布工作流
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run tests
      run: npm test
    
    - name: Create GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        body_path: CHANGELOG.md
        draft: false
        prerelease: false
    
    - name: Deploy to production
      run: ./scripts/deploy.sh production ${{ github.ref_name }}
      env:
        DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### 3. 回滚策略

#### 快速回滚脚本
```bash
#!/bin/bash
# scripts/rollback.sh

ENVIRONMENT=$1
PREVIOUS_VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$PREVIOUS_VERSION" ]; then
    echo "Usage: $0 <environment> <previous_version>"
    echo "Example: $0 production v1.0.0"
    exit 1
fi

echo "Rolling back $ENVIRONMENT to $PREVIOUS_VERSION..."

# 1. 回滚Kubernetes部署
kubectl rollout undo deployment/aims-frontend -n $ENVIRONMENT
kubectl rollout undo deployment/aims-backend -n $ENVIRONMENT

# 2. 等待回滚完成
kubectl rollout status deployment/aims-frontend -n $ENVIRONMENT
kubectl rollout status deployment/aims-backend -n $ENVIRONMENT

# 3. 验证回滚结果
./scripts/health-check.sh $ENVIRONMENT

echo "Rollback completed successfully!"
```
