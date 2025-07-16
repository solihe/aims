// LLM API 相关类型定义

export enum LLMProvider {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  MOONSHOT = 'moonshot',
  OPENROUTER = 'openrouter'
}

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProvider;
  contextLength: number;
  inputPrice: number; // 每1K tokens价格（美元）
  outputPrice: number; // 每1K tokens价格（美元）
  capabilities: string[];
  description?: string;
}

export interface LLMConfig {
  id: string;
  provider: LLMProvider;
  model: string;
  modelName?: string; // 自定义模型显示名称
  apiKey: string;
  baseUrl: string; // 改为必填，支持自定义URL
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LLMUsageStats {
  provider: LLMProvider;
  model: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  successRate: number;
  lastUsed: Date;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: LLMProvider;
  responseTime: number;
}

export interface LLMRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// 预定义的模型配置
export const AVAILABLE_MODELS: Record<LLMProvider, LLMModel[]> = {
  [LLMProvider.OPENAI]: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: LLMProvider.OPENAI,
      contextLength: 128000,
      inputPrice: 0.005,
      outputPrice: 0.015,
      capabilities: ['文本生成', '代码生成', '分析推理', '多语言'],
      description: 'OpenAI最新的多模态模型，性能强大'
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: LLMProvider.OPENAI,
      contextLength: 128000,
      inputPrice: 0.00015,
      outputPrice: 0.0006,
      capabilities: ['文本生成', '快速响应', '成本优化'],
      description: '轻量级版本，成本更低'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: LLMProvider.OPENAI,
      contextLength: 16385,
      inputPrice: 0.0005,
      outputPrice: 0.0015,
      capabilities: ['文本生成', '对话', '快速响应'],
      description: '经典模型，性价比高'
    }
  ],
  
  [LLMProvider.GEMINI]: [
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      provider: LLMProvider.GEMINI,
      contextLength: 2000000,
      inputPrice: 0.00125,
      outputPrice: 0.005,
      capabilities: ['长文本处理', '多模态', '代码生成', '分析推理'],
      description: 'Google最强模型，超长上下文'
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      provider: LLMProvider.GEMINI,
      contextLength: 1000000,
      inputPrice: 0.000075,
      outputPrice: 0.0003,
      capabilities: ['快速响应', '长文本', '多模态'],
      description: '快速版本，适合实时应用'
    }
  ],
  
  [LLMProvider.DEEPSEEK]: [
    {
      id: 'deepseek-chat',
      name: 'DeepSeek Chat',
      provider: LLMProvider.DEEPSEEK,
      contextLength: 32768,
      inputPrice: 0.00014,
      outputPrice: 0.00028,
      capabilities: ['中文优化', '代码生成', '数学推理'],
      description: '国产优秀模型，中文能力强'
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      provider: LLMProvider.DEEPSEEK,
      contextLength: 16384,
      inputPrice: 0.00014,
      outputPrice: 0.00028,
      capabilities: ['代码生成', '代码解释', '编程辅助'],
      description: '专业代码模型'
    }
  ],
  
  [LLMProvider.MOONSHOT]: [
    {
      id: 'moonshot-v1-8k',
      name: 'Moonshot v1 8K',
      provider: LLMProvider.MOONSHOT,
      contextLength: 8192,
      inputPrice: 0.0012,
      outputPrice: 0.0012,
      capabilities: ['中文优化', '文本生成', '对话'],
      description: 'Kimi模型，中文能力优秀'
    },
    {
      id: 'moonshot-v1-32k',
      name: 'Moonshot v1 32K',
      provider: LLMProvider.MOONSHOT,
      contextLength: 32768,
      inputPrice: 0.0024,
      outputPrice: 0.0024,
      capabilities: ['长文本处理', '中文优化', '文档分析'],
      description: '长上下文版本'
    },
    {
      id: 'moonshot-v1-128k',
      name: 'Moonshot v1 128K',
      provider: LLMProvider.MOONSHOT,
      contextLength: 131072,
      inputPrice: 0.0060,
      outputPrice: 0.0060,
      capabilities: ['超长文本', '文档处理', '深度分析'],
      description: '超长上下文，适合复杂任务'
    }
  ],
  
  [LLMProvider.OPENROUTER]: [
    {
      id: 'anthropic/claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: LLMProvider.OPENROUTER,
      contextLength: 200000,
      inputPrice: 0.003,
      outputPrice: 0.015,
      capabilities: ['推理分析', '代码生成', '长文本', '安全性'],
      description: 'Anthropic最强模型，通过OpenRouter访问'
    },
    {
      id: 'meta-llama/llama-3.1-405b-instruct',
      name: 'Llama 3.1 405B',
      provider: LLMProvider.OPENROUTER,
      contextLength: 131072,
      inputPrice: 0.005,
      outputPrice: 0.005,
      capabilities: ['开源模型', '大参数量', '多语言'],
      description: 'Meta最大开源模型'
    },
    {
      id: 'google/gemini-pro-1.5',
      name: 'Gemini Pro 1.5 (OR)',
      provider: LLMProvider.OPENROUTER,
      contextLength: 2000000,
      inputPrice: 0.00125,
      outputPrice: 0.005,
      capabilities: ['超长上下文', '多模态', '通过OR访问'],
      description: '通过OpenRouter访问的Gemini'
    }
  ]
};

// API端点配置
export const API_ENDPOINTS: Record<LLMProvider, string> = {
  [LLMProvider.OPENAI]: 'https://api.openai.com/v1',
  [LLMProvider.GEMINI]: 'https://generativelanguage.googleapis.com/v1beta',
  [LLMProvider.DEEPSEEK]: 'https://api.deepseek.com/v1',
  [LLMProvider.MOONSHOT]: 'https://api.moonshot.cn/v1',
  [LLMProvider.OPENROUTER]: 'https://openrouter.ai/api/v1'
};

// 默认配置
export const DEFAULT_LLM_CONFIGS: Partial<LLMConfig>[] = [
  {
    provider: LLMProvider.OPENAI,
    model: 'gpt-4o-mini',
    baseUrl: API_ENDPOINTS[LLMProvider.OPENAI],
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: true,
    isActive: false
  },
  {
    provider: LLMProvider.GEMINI,
    model: 'gemini-1.5-flash',
    baseUrl: API_ENDPOINTS[LLMProvider.GEMINI],
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
    isActive: false
  },
  {
    provider: LLMProvider.DEEPSEEK,
    model: 'deepseek-chat',
    baseUrl: API_ENDPOINTS[LLMProvider.DEEPSEEK],
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
    isActive: false
  }
];
