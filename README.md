# AIMS - 战略性内容编排系统

<div align="center">

![AIMS Logo](https://img.shields.io/badge/AIMS-战略性内容编排系统-blue?style=for-the-badge)

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/solihe/aims)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**AI驱动的营销战役管理平台，实现从策略制定到效果分析的完整闭环**

[功能特色](#-功能特色) • [快速开始](#-快速开始) • [系统架构](#-系统架构) • [使用指南](#-使用指南) • [开发文档](#-开发文档)

</div>

## 🎯 项目简介

AIMS (AI-driven Integrated Marketing Strategy) 是一个现代化的营销战役管理系统，专为企业和营销团队设计。通过AI技术驱动，实现从战略规划到内容执行的全流程自动化管理。

### 核心价值
- 🤖 **AI驱动**: 智能策略生成和内容创作
- 🔄 **完整闭环**: 策略→编排→执行→分析的完整工作流
- 🎯 **多战役管理**: 支持并行管理多个营销战役
- 📊 **数据驱动**: 基于效果数据的策略优化
- 🚀 **高效协作**: 团队协作和内容审核流程

## ✨ 功能特色

### 🏢 战役管理
- **多战役并行**: 支持创建和管理多个营销战役
- **状态跟踪**: 草稿、进行中、已暂停、已完成、已归档
- **智能搜索**: 按名称、目标、状态快速筛选
- **一键复制**: 基于成功战役快速创建新战役

### 🎯 策略制定
- **AI策略生成**: 基于营销目标智能生成传播策略
- **多目标支持**: 产品发布、品牌建设、线索获取、销售转化、危机管理
- **约束条件**: 预算、时间、平台等约束条件设置
- **反面提示**: 避免不当内容的反面提示词功能

### 📅 内容编排
- **智能日历**: 基于策略自动生成内容发布日历
- **多平台协调**: 微博、知乎、小红书等平台内容统一管理
- **内容生成**: AI自动生成标题、文案、话题标签
- **时间安排**: 智能的发布时间和频率安排

### 📝 内容工作区
- **在线编辑**: 实时编辑和优化生成的内容
- **审核流程**: 草稿→审批→发布的完整审核流程
- **预览功能**: 内容发布前的完整预览
- **状态管理**: 多维度的内容状态跟踪

### 📊 效果分析
- **数据监控**: 触达人数、互动量、转化率等核心指标
- **平台对比**: 各平台表现的详细对比分析
- **智能建议**: 基于数据的优化建议和策略调整
- **ROI评估**: 投资回报率和目标完成度评估

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆仓库**
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
打开浏览器访问 `http://localhost:5173`

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🏗️ 系统架构

### 技术栈
- **前端框架**: React 18.3.1 + TypeScript
- **构建工具**: Vite 5.4.8
- **状态管理**: Zustand 4.4.7
- **HTTP客户端**: Axios 1.6.2
- **UI组件**: Lucide React (图标)
- **样式方案**: Tailwind CSS

### 项目结构
```
src/
├── components/          # 组件目录
│   ├── campaign/       # 战役管理组件
│   ├── strategy/       # 策略制定组件
│   ├── orchestration/  # 内容编排组件
│   ├── workspace/      # 内容工作区组件
│   ├── analytics/      # 效果分析组件
│   └── llm/           # LLM配置组件
├── stores/             # 状态管理
│   ├── useStrategyStore.ts
│   ├── useContentStore.ts
│   ├── useLLMStore.ts
│   └── useAppStore.ts
├── services/           # 服务层
│   ├── strategy/       # 策略服务
│   ├── content/        # 内容服务
│   └── api/           # API客户端
├── types/              # 类型定义
├── data/              # 模拟数据
└── utils/             # 工具函数
```

## 📖 使用指南

### 1. 战役管理
- 在战役管理页面查看所有营销战役
- 点击"创建战役"开始新的营销活动
- 使用搜索和筛选功能快速找到目标战役
- 通过"选择"按钮切换当前工作的战役

### 2. 策略制定
- 选择营销目标（产品发布、品牌建设等）
- 详细描述营销需求和目标受众
- 设置约束条件和反面提示词
- 点击"制定传播策略"生成AI策略

### 3. 内容编排
- 基于生成的策略自动创建内容日历
- 查看各平台的具体内容安排
- 按周次和平台筛选内容
- 点击"进入工作区"开始内容审核

### 4. 内容工作区
- 编辑和优化AI生成的内容
- 通过审批流程管理内容状态
- 使用预览功能查看最终效果
- 标记内容为已发布状态

### 5. 效果分析
- 查看核心传播指标和趋势
- 分析各平台的表现对比
- 获取基于数据的优化建议
- 评估战役ROI和目标完成度

## 🔧 开发文档

### 状态管理
系统使用Zustand进行状态管理，主要包括：
- `useStrategyStore`: 策略和战役管理
- `useContentStore`: 内容和日历管理
- `useLLMStore`: LLM配置管理
- `useAppStore`: 全局应用状态

### API设计
```typescript
// 策略服务示例
interface StrategyService {
  createStrategy(intent: MarketingIntent): Promise<CampaignStrategy>;
  updateStrategy(id: string, updates: Partial<CampaignStrategy>): Promise<CampaignStrategy>;
  deleteStrategy(id: string): Promise<void>;
  duplicateStrategy(strategy: CampaignStrategy): Promise<CampaignStrategy>;
}
```

### 组件开发规范
- 使用TypeScript进行类型安全开发
- 遵循React Hooks最佳实践
- 组件props使用interface定义
- 统一的错误处理和加载状态

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 现代化构建工具
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- [Lucide](https://lucide.dev/) - 美观的图标库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架

---

<div align="center">

**[⬆ 回到顶部](#aims---战略性内容编排系统)**

Made with ❤️ by [solihe](https://github.com/solihe)

</div>
