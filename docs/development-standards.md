# AIMS 开发规范标准

## 📝 代码规范

### 1. TypeScript/JavaScript 规范

#### 命名约定
```typescript
// 变量和函数：camelCase
const userName = 'john_doe';
const getUserProfile = () => {};

// 常量：UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// 类名：PascalCase
class AgentManager {}
class ContentGenerator {}

// 接口：PascalCase，以I开头（可选）
interface AgentConfig {}
interface ILLMProvider {}

// 枚举：PascalCase
enum AgentType {
  CMO = 'cmo',
  Intelligence = 'intelligence',
  Platform = 'platform'
}

// 文件名：kebab-case
// agent-manager.ts
// content-generator.ts
// llm-service.ts
```

#### 代码格式化
```typescript
// 使用Prettier配置
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}

// 函数声明
const processContent = async (
  content: string,
  options: ProcessOptions
): Promise<ProcessResult> => {
  // 函数体
};

// 对象解构
const { agentId, agentName, capabilities } = agentConfig;

// 数组解构
const [firstAgent, secondAgent, ...restAgents] = agents;
```

#### 类型定义
```typescript
// 严格类型定义
interface AgentTask {
  readonly id: string;
  readonly type: AgentTaskType;
  readonly priority: Priority;
  readonly context: Record<string, unknown>;
  readonly deadline?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// 泛型使用
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// 联合类型
type AgentStatus = 'idle' | 'busy' | 'error' | 'offline';
type ContentPlatform = 'weibo' | 'xiaohongshu' | 'douyin' | 'zhihu';
```

### 2. React 组件规范

#### 函数组件结构
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { AgentConfig } from '../types/agent';
import { useAgentStore } from '../stores/agentStore';

interface AgentConfigPanelProps {
  agentId: string;
  onConfigChange?: (config: AgentConfig) => void;
  className?: string;
}

export const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({
  agentId,
  onConfigChange,
  className = ''
}) => {
  // 1. Hooks
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateAgentConfig } = useAgentStore();

  // 2. Effects
  useEffect(() => {
    loadAgentConfig();
  }, [agentId]);

  // 3. Callbacks
  const handleConfigUpdate = useCallback(async (newConfig: AgentConfig) => {
    setLoading(true);
    try {
      await updateAgentConfig(agentId, newConfig);
      setConfig(newConfig);
      onConfigChange?.(newConfig);
    } catch (error) {
      console.error('Failed to update agent config:', error);
    } finally {
      setLoading(false);
    }
  }, [agentId, updateAgentConfig, onConfigChange]);

  // 4. Helper functions
  const loadAgentConfig = async () => {
    // Implementation
  };

  // 5. Early returns
  if (!config) {
    return <div>Loading...</div>;
  }

  // 6. Render
  return (
    <div className={`agent-config-panel ${className}`}>
      {/* Component content */}
    </div>
  );
};

export default AgentConfigPanel;
```

#### 自定义Hook规范
```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseAgentOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useAgent = (agentId: string, options: UseAgentOptions = {}) => {
  const { autoRefresh = false, refreshInterval = 5000 } = options;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgent = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const agentData = await agentService.getAgent(agentId);
      setAgent(agentData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAgent, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchAgent]);

  return {
    agent,
    loading,
    error,
    refetch: fetchAgent
  };
};
```

### 3. Node.js 后端规范

#### 服务层结构
```typescript
// services/agent-service.ts
import { Agent, AgentConfig, AgentTask } from '../types';
import { AgentRepository } from '../repositories/agent-repository';
import { EventBus } from '../utils/event-bus';

export class AgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly eventBus: EventBus
  ) {}

  async createAgent(config: AgentConfig): Promise<Agent> {
    // 1. 验证输入
    this.validateAgentConfig(config);

    // 2. 创建Agent
    const agent = await this.agentRepository.create({
      ...config,
      status: 'idle',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 3. 发布事件
    this.eventBus.publish('agent.created', { agentId: agent.id });

    // 4. 返回结果
    return agent;
  }

  async assignTask(agentId: string, task: AgentTask): Promise<void> {
    const agent = await this.getAgentById(agentId);
    
    if (agent.status !== 'idle') {
      throw new Error(`Agent ${agentId} is not available`);
    }

    await this.agentRepository.updateStatus(agentId, 'busy');
    this.eventBus.publish('task.assigned', { agentId, taskId: task.id });
  }

  private validateAgentConfig(config: AgentConfig): void {
    if (!config.name || config.name.trim().length === 0) {
      throw new Error('Agent name is required');
    }
    
    if (!config.type || !Object.values(AgentType).includes(config.type)) {
      throw new Error('Invalid agent type');
    }
  }

  private async getAgentById(agentId: string): Promise<Agent> {
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    return agent;
  }
}
```

#### 控制器规范
```typescript
// controllers/agent-controller.ts
import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agent-service';
import { validateRequest } from '../middleware/validation';
import { createAgentSchema } from '../schemas/agent-schemas';

export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  createAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. 验证请求
      const validatedData = validateRequest(req.body, createAgentSchema);
      
      // 2. 调用服务
      const agent = await this.agentService.createAgent(validatedData);
      
      // 3. 返回响应
      res.status(201).json({
        success: true,
        data: agent,
        message: 'Agent created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const agent = await this.agentService.getAgentById(agentId);
      
      res.json({
        success: true,
        data: agent
      });
    } catch (error) {
      next(error);
    }
  };
}
```

## 📋 注释标准

### 1. 函数注释
```typescript
/**
 * 生成指定平台的内容
 * 
 * @param topic - 内容主题
 * @param platform - 目标平台
 * @param options - 生成选项
 * @returns Promise<生成的内容>
 * 
 * @example
 * ```typescript
 * const content = await generateContent(
 *   'AI技术发展趋势',
 *   'weibo',
 *   { tone: 'professional', maxLength: 140 }
 * );
 * ```
 * 
 * @throws {ValidationError} 当输入参数无效时
 * @throws {LLMServiceError} 当LLM服务调用失败时
 */
async function generateContent(
  topic: string,
  platform: ContentPlatform,
  options: GenerateOptions = {}
): Promise<string> {
  // 实现逻辑
}
```

### 2. 类注释
```typescript
/**
 * Agent管理器
 * 
 * 负责Agent的创建、配置、任务分配和状态管理。
 * 支持多种类型的Agent，包括CMO、情报收集和平台专属Agent。
 * 
 * @example
 * ```typescript
 * const manager = new AgentManager();
 * const agent = await manager.createAgent({
 *   type: 'cmo',
 *   name: 'CMO Agent',
 *   config: { ... }
 * });
 * ```
 */
export class AgentManager {
  /**
   * 活跃的Agent列表
   * @private
   */
  private readonly activeAgents = new Map<string, Agent>();

  /**
   * 创建新的Agent
   * @param config - Agent配置
   * @returns 创建的Agent实例
   */
  async createAgent(config: AgentConfig): Promise<Agent> {
    // 实现逻辑
  }
}
```

### 3. 复杂逻辑注释
```typescript
function calculateContentScore(content: string, metrics: ContentMetrics): number {
  // 基础分数：根据内容长度和质量
  let score = Math.min(content.length / 100, 10);
  
  // 参与度加权：点赞、评论、转发的综合影响
  const engagementWeight = 0.4;
  const engagementScore = (
    metrics.likes * 0.3 + 
    metrics.comments * 0.5 + 
    metrics.shares * 0.2
  ) / metrics.views;
  score += engagementScore * engagementWeight * 10;
  
  // 时效性调整：新内容获得额外加分
  const ageInHours = (Date.now() - metrics.publishedAt.getTime()) / (1000 * 60 * 60);
  const timeDecayFactor = Math.exp(-ageInHours / 24); // 24小时半衰期
  score *= (1 + timeDecayFactor * 0.2);
  
  // 确保分数在合理范围内
  return Math.max(0, Math.min(100, score));
}
```

## 🧪 测试规范

### 1. 单元测试
```typescript
// tests/services/agent-service.test.ts
import { AgentService } from '../../src/services/agent-service';
import { AgentRepository } from '../../src/repositories/agent-repository';
import { EventBus } from '../../src/utils/event-bus';

describe('AgentService', () => {
  let agentService: AgentService;
  let mockAgentRepository: jest.Mocked<AgentRepository>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    mockAgentRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    mockEventBus = {
      publish: jest.fn(),
    } as any;

    agentService = new AgentService(mockAgentRepository, mockEventBus);
  });

  describe('createAgent', () => {
    it('should create agent successfully', async () => {
      // Arrange
      const config = {
        name: 'Test Agent',
        type: 'cmo' as const,
        capabilities: ['content-generation']
      };
      
      const expectedAgent = {
        id: 'agent-123',
        ...config,
        status: 'idle',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      };

      mockAgentRepository.create.mockResolvedValue(expectedAgent);

      // Act
      const result = await agentService.createAgent(config);

      // Assert
      expect(result).toEqual(expectedAgent);
      expect(mockAgentRepository.create).toHaveBeenCalledWith({
        ...config,
        status: 'idle',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        'agent.created',
        { agentId: 'agent-123' }
      );
    });

    it('should throw error for invalid config', async () => {
      // Arrange
      const invalidConfig = {
        name: '',
        type: 'invalid' as any,
        capabilities: []
      };

      // Act & Assert
      await expect(agentService.createAgent(invalidConfig))
        .rejects
        .toThrow('Agent name is required');
    });
  });
});
```

### 2. 集成测试
```typescript
// tests/integration/agent-api.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';

describe('Agent API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/agents', () => {
    it('should create agent and return 201', async () => {
      const agentConfig = {
        name: 'Test Agent',
        type: 'cmo',
        capabilities: ['content-generation']
      };

      const response = await request(app)
        .post('/api/agents')
        .send(agentConfig)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          name: 'Test Agent',
          type: 'cmo',
          status: 'idle'
        },
        message: 'Agent created successfully'
      });
    });

    it('should return 400 for invalid input', async () => {
      const invalidConfig = {
        name: '',
        type: 'invalid'
      };

      const response = await request(app)
        .post('/api/agents')
        .send(invalidConfig)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.any(String)
      });
    });
  });
});
```

### 3. 端到端测试
```typescript
// tests/e2e/content-generation.test.ts
import { test, expect } from '@playwright/test';

test.describe('Content Generation Flow', () => {
  test('should generate content for multiple platforms', async ({ page }) => {
    // 1. 导航到内容生成页面
    await page.goto('/content-generation');
    
    // 2. 输入主题
    await page.fill('[data-testid="topic-input"]', 'AI技术发展趋势');
    
    // 3. 选择平台
    await page.check('[data-testid="platform-weibo"]');
    await page.check('[data-testid="platform-xiaohongshu"]');
    
    // 4. 点击生成按钮
    await page.click('[data-testid="generate-button"]');
    
    // 5. 等待生成完成
    await page.waitForSelector('[data-testid="generation-complete"]');
    
    // 6. 验证结果
    const weiboContent = await page.textContent('[data-testid="weibo-content"]');
    const xiaohongshuContent = await page.textContent('[data-testid="xiaohongshu-content"]');
    
    expect(weiboContent).toBeTruthy();
    expect(xiaohongshuContent).toBeTruthy();
    expect(weiboContent!.length).toBeLessThanOrEqual(140);
    expect(xiaohongshuContent!.length).toBeLessThanOrEqual(1000);
  });
});
```

## 🔍 代码审查流程

### 1. 审查清单

#### 功能性检查
- [ ] 代码实现符合需求规格
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 性能考虑合理

#### 代码质量检查
- [ ] 命名清晰易懂
- [ ] 函数职责单一
- [ ] 代码复用合理
- [ ] 注释充分准确

#### 安全性检查
- [ ] 输入验证完整
- [ ] 敏感信息保护
- [ ] 权限控制正确
- [ ] SQL注入防护

#### 测试覆盖检查
- [ ] 单元测试充分
- [ ] 集成测试覆盖
- [ ] 边界情况测试
- [ ] 错误场景测试

### 2. 审查工具配置

#### GitHub PR模板
```markdown
## 变更描述
简要描述本次变更的内容和目的

## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 重构
- [ ] 文档更新
- [ ] 性能优化

## 测试情况
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成
- [ ] 性能测试通过

## 审查要点
请重点关注以下方面：
- 
- 

## 相关Issue
Closes #
```

#### SonarQube配置
```yaml
# sonar-project.properties
sonar.projectKey=aims-project
sonar.projectName=AIMS
sonar.projectVersion=1.0
sonar.sources=src
sonar.tests=tests
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts
```

## 📊 质量度量

### 1. 代码质量指标
- **圈复杂度**: 平均 < 5，最大 < 10
- **代码重复率**: < 3%
- **技术债务比率**: < 5%
- **可维护性指数**: > 70

### 2. 测试质量指标
- **代码覆盖率**: > 80%
- **分支覆盖率**: > 75%
- **测试通过率**: > 95%
- **测试执行时间**: < 10分钟

### 3. 性能指标
- **构建时间**: < 5分钟
- **启动时间**: < 30秒
- **内存使用**: < 512MB
- **响应时间**: < 500ms
