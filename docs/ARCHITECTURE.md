# AIMS 系统架构文档

## 🏗️ 整体架构

AIMS采用现代化的前端架构，基于React + TypeScript构建，使用Vite作为构建工具，Zustand进行状态管理。

```
┌─────────────────────────────────────────────────────────────┐
│                    AIMS 系统架构                              │
├─────────────────────────────────────────────────────────────┤
│  用户界面层 (UI Layer)                                        │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │ 战役管理     │ 策略制定     │ 内容编排     │ 工作区      │   │
│  │ Campaign    │ Strategy    │ Orchestration│ Workspace  │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  业务逻辑层 (Business Logic Layer)                            │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │ 策略服务     │ 内容服务     │ 分析服务     │ LLM服务     │   │
│  │ Strategy    │ Content     │ Analytics   │ LLM        │   │
│  │ Service     │ Service     │ Service     │ Service    │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  状态管理层 (State Management Layer)                          │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │ Strategy    │ Content     │ LLM         │ App         │   │
│  │ Store       │ Store       │ Store       │ Store       │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  数据访问层 (Data Access Layer)                               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │ API Client  │ Local       │ Mock Data   │ Cache       │   │
│  │             │ Storage     │             │ Manager     │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 项目结构

```
src/
├── components/              # 组件目录
│   ├── campaign/           # 战役管理组件
│   │   └── CampaignManager.tsx
│   ├── strategy/           # 策略制定组件
│   │   └── StrategyPlanner.tsx
│   ├── orchestration/      # 内容编排组件
│   │   └── ContentOrchestration.tsx
│   ├── workspace/          # 内容工作区组件
│   │   └── ContentWorkspace.tsx
│   ├── analytics/          # 效果分析组件
│   │   └── EffectAnalytics.tsx
│   └── llm/               # LLM配置组件
│       ├── LLMSettings.tsx
│       └── LLMSelector.tsx
├── stores/                 # 状态管理
│   ├── useStrategyStore.ts # 策略状态管理
│   ├── useContentStore.ts  # 内容状态管理
│   ├── useLLMStore.ts     # LLM配置状态管理
│   └── useAppStore.ts     # 全局应用状态
├── services/              # 服务层
│   ├── strategy/          # 策略服务
│   │   └── strategyService.ts
│   ├── content/           # 内容服务
│   │   └── contentService.ts
│   └── api/              # API客户端
│       └── apiClient.ts
├── types/                 # 类型定义
│   └── index.ts
├── data/                  # 模拟数据
│   └── mockData.ts
├── utils/                 # 工具函数
└── App.tsx               # 主应用组件
```

## 🔄 数据流架构

### 单向数据流
```
用户操作 → 组件事件 → Store Action → Service调用 → API请求
    ↓
UI更新 ← 组件重渲染 ← Store状态更新 ← Service响应 ← API响应
```

### 状态管理流程
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   用户操作   │───→│  组件事件    │───→│ Store Action │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UI更新    │←───│  状态变更    │←───│ Service调用  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🧩 核心模块设计

### 1. 战役管理模块 (Campaign Management)

**职责**: 管理多个营销战役的生命周期

**核心功能**:
- 战役CRUD操作
- 状态管理和跟踪
- 搜索和筛选
- 战役复制和模板

**数据模型**:
```typescript
interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  strategy: CampaignStrategy;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. 策略制定模块 (Strategy Planning)

**职责**: AI驱动的营销策略生成和管理

**核心功能**:
- 营销意图解析
- AI策略生成
- 策略编辑和优化
- 约束条件管理

**数据模型**:
```typescript
interface CampaignStrategy {
  id: string;
  name: string;
  objective: MarketingObjective;
  phases: StrategyPhase[];
  platformRoles: PlatformRoles;
  contentThemes: string[];
}
```

### 3. 内容编排模块 (Content Orchestration)

**职责**: 基于策略生成内容日历和具体内容

**核心功能**:
- 内容日历生成
- 多平台内容协调
- 发布时间优化
- 内容模板管理

**数据模型**:
```typescript
interface ContentCalendarItem {
  id: string;
  week: number;
  platform: string;
  contentType: string;
  title: string;
  content: string;
  publishTime: string;
  status: ContentStatus;
}
```

### 4. 内容工作区模块 (Content Workspace)

**职责**: 内容审核、编辑和发布管理

**核心功能**:
- 在线内容编辑
- 审核流程管理
- 内容预览
- 批量操作

### 5. 效果分析模块 (Analytics)

**职责**: 数据分析和效果评估

**核心功能**:
- 数据收集和处理
- 指标计算和展示
- 趋势分析
- 优化建议生成

## 🔧 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.1 | 用户界面框架 |
| TypeScript | 5.2.2 | 类型安全 |
| Vite | 5.4.8 | 构建工具 |
| Zustand | 4.4.7 | 状态管理 |
| Axios | 1.6.2 | HTTP客户端 |
| Lucide React | 0.344.0 | 图标库 |
| Tailwind CSS | - | 样式框架 |

### 状态管理架构

使用Zustand实现轻量级状态管理：

```typescript
// Store结构示例
interface StrategyStore {
  // 状态
  currentStrategy: CampaignStrategy | null;
  strategies: CampaignStrategy[];
  isCreating: boolean;
  
  // 操作
  createStrategy: (intent: MarketingIntent) => Promise<CampaignStrategy>;
  updateStrategy: (id: string, updates: Partial<CampaignStrategy>) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
}
```

### 服务层架构

采用服务层模式封装业务逻辑：

```typescript
class StrategyService {
  private isDevelopment = import.meta.env.DEV;
  
  async createStrategy(intent: MarketingIntent): Promise<CampaignStrategy> {
    // 业务逻辑实现
  }
  
  async updateStrategy(id: string, updates: Partial<CampaignStrategy>): Promise<CampaignStrategy> {
    // 业务逻辑实现
  }
}
```

## 🔐 安全架构

### 数据安全
- API密钥加密存储
- 敏感数据本地加密
- 安全的HTTP通信

### 访问控制
- 基于角色的权限管理
- 操作权限验证
- 数据访问控制

### 错误处理
- 统一错误处理机制
- 用户友好的错误提示
- 错误日志记录

## 📊 性能架构

### 前端性能优化
- 代码分割和懒加载
- 组件级别的性能优化
- 虚拟化长列表
- 图片懒加载

### 数据缓存策略
- 内存缓存热点数据
- 本地存储持久化
- 智能缓存失效

### 网络优化
- HTTP请求合并
- 响应数据压缩
- CDN资源加速

## 🧪 测试架构

### 测试策略
- 单元测试：核心业务逻辑
- 集成测试：组件交互
- 端到端测试：用户流程
- 性能测试：系统负载

### 测试工具
- Jest：单元测试框架
- React Testing Library：组件测试
- Cypress：端到端测试
- Lighthouse：性能测试

## 🚀 部署架构

### 构建流程
```
源代码 → TypeScript编译 → Vite构建 → 静态资源 → CDN部署
```

### 环境管理
- 开发环境：本地开发和调试
- 测试环境：功能测试和集成测试
- 生产环境：正式部署和运行

### CI/CD流程
```
代码提交 → 自动测试 → 构建打包 → 部署发布 → 监控告警
```

## 📈 扩展性设计

### 模块化设计
- 松耦合的模块结构
- 标准化的接口定义
- 可插拔的组件架构

### 可配置性
- 灵活的配置系统
- 主题和样式定制
- 功能开关控制

### 国际化支持
- 多语言资源管理
- 本地化适配
- 文化差异处理

---

<div align="center">

**[⬆ 回到顶部](#aims-系统架构文档)**

更多技术细节请参考源代码和API文档

</div>
