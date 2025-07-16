# AIMS 项目结构规范

## 📁 目录结构总览

```
AIMS/
├── 📁 src/                          # 源代码目录
│   ├── 📁 components/               # React组件
│   ├── 📁 services/                 # 业务服务层
│   ├── 📁 stores/                   # 状态管理
│   ├── 📁 types/                    # TypeScript类型定义
│   ├── 📁 utils/                    # 工具函数
│   ├── 📁 hooks/                    # 自定义React Hooks
│   ├── 📁 constants/                # 常量定义
│   ├── 📁 assets/                   # 静态资源
│   └── 📁 styles/                   # 样式文件
├── 📁 backend/                      # 后端服务目录
│   ├── 📁 src/                      # 后端源代码
│   │   ├── 📁 controllers/          # 控制器层
│   │   ├── 📁 services/             # 业务服务层
│   │   ├── 📁 repositories/         # 数据访问层
│   │   ├── 📁 models/               # 数据模型
│   │   ├── 📁 middleware/           # 中间件
│   │   ├── 📁 routes/               # 路由定义
│   │   ├── 📁 utils/                # 工具函数
│   │   ├── 📁 config/               # 配置文件
│   │   └── 📁 types/                # 类型定义
│   ├── 📁 tests/                    # 后端测试
│   └── 📁 scripts/                  # 脚本文件
├── 📁 tests/                        # 前端测试目录
│   ├── 📁 unit/                     # 单元测试
│   ├── 📁 integration/              # 集成测试
│   ├── 📁 e2e/                      # 端到端测试
│   └── 📁 helpers/                  # 测试辅助工具
├── 📁 docs/                         # 项目文档
├── 📁 scripts/                      # 构建和部署脚本
├── 📁 config/                       # 配置文件
└── 📁 public/                       # 公共静态文件
```

## 🎯 前端结构详解

### 1. 组件目录结构 (src/components/)

```
components/
├── 📁 common/                       # 通用组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Modal/
│   ├── Loading/
│   └── index.ts                     # 统一导出
├── 📁 layout/                       # 布局组件
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── MainLayout/
├── 📁 features/                     # 功能特性组件
│   ├── agent/                       # Agent相关组件
│   │   ├── AgentCard/
│   │   ├── AgentConfig/
│   │   ├── AgentList/
│   │   └── index.ts
│   ├── content/                     # 内容相关组件
│   │   ├── ContentEditor/
│   │   ├── ContentPreview/
│   │   ├── ContentReview/
│   │   └── index.ts
│   └── dashboard/                   # 仪表板组件
├── 📁 pages/                        # 页面级组件
│   ├── Dashboard/
│   ├── AgentManagement/
│   ├── ContentGeneration/
│   └── Settings/
└── index.ts                         # 组件总导出
```

#### 组件文件命名规范
```typescript
// 组件文件结构示例
AgentCard/
├── AgentCard.tsx                    # 主组件文件
├── AgentCard.test.tsx               # 单元测试
├── AgentCard.stories.tsx            # Storybook故事
├── AgentCard.module.css             # 样式文件（如果使用CSS Modules）
├── types.ts                         # 组件相关类型
├── hooks.ts                         # 组件专用hooks
└── index.ts                         # 导出文件

// index.ts 内容
export { AgentCard } from './AgentCard';
export type { AgentCardProps } from './types';
```

### 2. 服务层结构 (src/services/)

```
services/
├── 📁 api/                          # API服务
│   ├── agent-api.ts                 # Agent相关API
│   ├── content-api.ts               # 内容相关API
│   ├── llm-api.ts                   # LLM服务API
│   └── base-api.ts                  # 基础API配置
├── 📁 llm/                          # LLM服务提供商
│   ├── providers/
│   │   ├── openai-provider.ts
│   │   ├── claude-provider.ts
│   │   ├── local-provider.ts
│   │   └── base-provider.ts
│   ├── llm-service.ts               # LLM服务管理器
│   └── types.ts                     # LLM相关类型
├── 📁 agent/                        # Agent服务
│   ├── agent-manager.ts             # Agent管理器
│   ├── agent-patterns.ts            # Agent设计模式
│   ├── collaboration.ts             # Agent协作机制
│   └── types.ts                     # Agent相关类型
├── 📁 content/                      # 内容服务
│   ├── content-generator.ts         # 内容生成器
│   ├── content-reviewer.ts          # 内容审核器
│   ├── platform-adapters.ts        # 平台适配器
│   └── types.ts                     # 内容相关类型
└── 📁 data/                         # 数据服务
    ├── web-scraping.ts              # 网页抓取
    ├── news-service.ts              # 新闻服务
    ├── analytics.ts                 # 数据分析
    └── types.ts                     # 数据相关类型
```

### 3. 状态管理结构 (src/stores/)

```
stores/
├── 📁 slices/                       # Redux Toolkit切片
│   ├── agent-slice.ts               # Agent状态切片
│   ├── content-slice.ts             # 内容状态切片
│   ├── ui-slice.ts                  # UI状态切片
│   └── user-slice.ts                # 用户状态切片
├── 📁 hooks/                        # 状态相关hooks
│   ├── use-agent-store.ts
│   ├── use-content-store.ts
│   └── use-ui-store.ts
├── store.ts                         # 主store配置
├── middleware.ts                    # 自定义中间件
└── types.ts                         # 状态相关类型
```

### 4. 类型定义结构 (src/types/)

```
types/
├── 📁 api/                          # API相关类型
│   ├── agent.ts
│   ├── content.ts
│   ├── llm.ts
│   └── common.ts
├── 📁 components/                   # 组件相关类型
│   ├── agent-components.ts
│   ├── content-components.ts
│   └── common-components.ts
├── 📁 services/                     # 服务相关类型
│   ├── agent-service.ts
│   ├── llm-service.ts
│   └── content-service.ts
├── global.ts                        # 全局类型
├── env.ts                           # 环境变量类型
└── index.ts                         # 类型总导出
```

## 🔧 后端结构详解

### 1. 控制器层 (backend/src/controllers/)

```
controllers/
├── base-controller.ts               # 基础控制器
├── agent-controller.ts              # Agent控制器
├── content-controller.ts            # 内容控制器
├── llm-controller.ts                # LLM控制器
├── analytics-controller.ts          # 分析控制器
└── health-controller.ts             # 健康检查控制器
```

#### 控制器文件结构示例
```typescript
// agent-controller.ts
import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agent-service';
import { validateRequest } from '../middleware/validation';
import { agentSchemas } from '../schemas/agent-schemas';

export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  // GET /api/agents
  getAgents = async (req: Request, res: Response, next: NextFunction) => {
    // 实现逻辑
  };

  // POST /api/agents
  createAgent = async (req: Request, res: Response, next: NextFunction) => {
    // 实现逻辑
  };

  // GET /api/agents/:id
  getAgent = async (req: Request, res: Response, next: NextFunction) => {
    // 实现逻辑
  };

  // PUT /api/agents/:id
  updateAgent = async (req: Request, res: Response, next: NextFunction) => {
    // 实现逻辑
  };

  // DELETE /api/agents/:id
  deleteAgent = async (req: Request, res: Response, next: NextFunction) => {
    // 实现逻辑
  };
}
```

### 2. 服务层 (backend/src/services/)

```
services/
├── 📁 agent/                        # Agent服务
│   ├── agent-service.ts
│   ├── agent-orchestrator.ts
│   ├── agent-factory.ts
│   └── types.ts
├── 📁 llm/                          # LLM服务
│   ├── llm-service.ts
│   ├── provider-manager.ts
│   ├── cost-tracker.ts
│   └── types.ts
├── 📁 content/                      # 内容服务
│   ├── content-service.ts
│   ├── content-generator.ts
│   ├── content-reviewer.ts
│   └── types.ts
├── 📁 data/                         # 数据服务
│   ├── scraping-service.ts
│   ├── news-service.ts
│   ├── analytics-service.ts
│   └── types.ts
└── 📁 external/                     # 外部服务集成
    ├── openai-service.ts
    ├── claude-service.ts
    ├── browser-use-service.ts
    └── types.ts
```

### 3. 数据访问层 (backend/src/repositories/)

```
repositories/
├── base-repository.ts               # 基础仓储接口
├── agent-repository.ts              # Agent数据访问
├── content-repository.ts            # 内容数据访问
├── user-repository.ts               # 用户数据访问
├── analytics-repository.ts          # 分析数据访问
└── types.ts                         # 仓储相关类型
```

### 4. 数据模型 (backend/src/models/)

```
models/
├── 📁 entities/                     # 实体模型
│   ├── agent.ts
│   ├── content.ts
│   ├── user.ts
│   └── analytics.ts
├── 📁 dto/                          # 数据传输对象
│   ├── agent-dto.ts
│   ├── content-dto.ts
│   └── common-dto.ts
├── 📁 schemas/                      # 验证模式
│   ├── agent-schemas.ts
│   ├── content-schemas.ts
│   └── common-schemas.ts
└── index.ts                         # 模型总导出
```

## 📦 依赖管理规范

### 1. 包管理策略

#### 前端依赖分类
```json
{
  "dependencies": {
    // 核心框架
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    
    // 状态管理
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    
    // UI组件库
    "lucide-react": "^0.344.0",
    
    // 工具库
    "lodash": "^4.17.21",
    "date-fns": "^3.0.0",
    
    // HTTP客户端
    "axios": "^1.6.0"
  },
  "devDependencies": {
    // 构建工具
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2",
    
    // 类型定义
    "@types/react": "^18.3.5",
    "@types/lodash": "^4.14.0",
    
    // 代码质量
    "eslint": "^9.9.1",
    "prettier": "^3.0.0",
    
    // 测试工具
    "@testing-library/react": "^14.0.0",
    "jest": "^29.0.0",
    "playwright": "^1.40.0"
  }
}
```

#### 后端依赖分类
```json
{
  "dependencies": {
    // 核心框架
    "express": "^4.18.0",
    "cors": "^2.8.5",
    
    // 数据库
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    
    // 认证授权
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    
    // 验证
    "joi": "^17.11.0",
    
    // 日志
    "winston": "^3.11.0",
    
    // 环境配置
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    // TypeScript
    "typescript": "^5.5.3",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    
    // 测试
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    
    // 开发工具
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0"
  }
}
```

### 2. 版本管理策略

#### 语义化版本控制
```
主版本号.次版本号.修订号 (MAJOR.MINOR.PATCH)

MAJOR: 不兼容的API修改
MINOR: 向下兼容的功能性新增
PATCH: 向下兼容的问题修正
```

#### 依赖版本策略
```json
{
  "dependencies": {
    // 精确版本：关键依赖
    "react": "18.3.1",
    
    // 兼容版本：稳定依赖
    "lodash": "^4.17.21",
    
    // 次版本锁定：快速迭代的库
    "axios": "~1.6.0"
  }
}
```

### 3. 模块导入规范

#### 导入顺序
```typescript
// 1. Node.js内置模块
import fs from 'fs';
import path from 'path';

// 2. 第三方库
import React from 'react';
import { Router } from 'express';
import _ from 'lodash';

// 3. 内部模块 - 绝对路径
import { AgentService } from '@/services/agent-service';
import { Button } from '@/components/common/Button';

// 4. 相对路径导入
import { validateInput } from '../utils/validation';
import { AgentConfig } from './types';
```

#### 路径别名配置
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  }
});

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

## 📄 文件命名规范

### 1. 文件命名约定

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| React组件 | PascalCase | `AgentCard.tsx` |
| 普通函数/类 | camelCase | `agentService.ts` |
| 常量文件 | UPPER_SNAKE_CASE | `API_CONSTANTS.ts` |
| 类型定义 | kebab-case | `agent-types.ts` |
| 测试文件 | 原文件名 + .test | `AgentCard.test.tsx` |
| 故事文件 | 原文件名 + .stories | `Button.stories.tsx` |
| 样式文件 | kebab-case | `agent-card.module.css` |
| 配置文件 | kebab-case | `vite.config.ts` |

### 2. 目录命名约定

| 目录类型 | 命名规范 | 示例 |
|---------|---------|------|
| 功能模块 | kebab-case | `agent-management/` |
| 组件目录 | PascalCase | `AgentCard/` |
| 服务目录 | kebab-case | `llm-service/` |
| 工具目录 | kebab-case | `date-utils/` |

## 🔄 模块化设计原则

### 1. 高内聚低耦合
```typescript
// ❌ 错误示例：高耦合
class AgentManager {
  generateContent(topic: string) {
    // 直接调用具体的LLM服务
    const openai = new OpenAIService();
    return openai.generate(topic);
  }
}

// ✅ 正确示例：低耦合
class AgentManager {
  constructor(private llmService: LLMService) {}
  
  generateContent(topic: string) {
    // 依赖抽象接口
    return this.llmService.generate(topic);
  }
}
```

### 2. 单一职责原则
```typescript
// ❌ 错误示例：职责混乱
class ContentService {
  generateContent() { /* 生成内容 */ }
  saveContent() { /* 保存内容 */ }
  sendEmail() { /* 发送邮件 */ }
  logActivity() { /* 记录日志 */ }
}

// ✅ 正确示例：职责单一
class ContentGenerator {
  generateContent() { /* 只负责生成内容 */ }
}

class ContentRepository {
  saveContent() { /* 只负责保存内容 */ }
}

class EmailService {
  sendEmail() { /* 只负责发送邮件 */ }
}

class Logger {
  logActivity() { /* 只负责记录日志 */ }
}
```

### 3. 依赖注入
```typescript
// 依赖注入容器
class DIContainer {
  private services = new Map();
  
  register<T>(token: string, factory: () => T): void {
    this.services.set(token, factory);
  }
  
  resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) {
      throw new Error(`Service not found: ${token}`);
    }
    return factory();
  }
}

// 服务注册
container.register('LLMService', () => new LLMService());
container.register('AgentManager', () => 
  new AgentManager(container.resolve('LLMService'))
);
```
