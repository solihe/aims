// LLM服务管理器 - 支持Openrouter和国内主流提供商
export interface LLMConfig {
  modelId: string;
  provider: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  fallbackModel?: string;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  cost: number;
}

class LLMService {
  private providers: Map<string, LLMProvider> = new Map();
  private costTracker: CostTracker;
  private loadBalancer: LoadBalancer;

  constructor() {
    this.initializeProviders();
    this.costTracker = new CostTracker();
    this.loadBalancer = new LoadBalancer();
  }

  // 初始化所有LLM提供商
  private initializeProviders() {
    // Openrouter - 统一调用国外模型
    this.providers.set('openrouter', new OpenrouterProvider({
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    }));

    // 硅基流动
    this.providers.set('siliconflow', new SiliconFlowProvider({
      apiKey: import.meta.env.VITE_SILICONFLOW_API_KEY,
      baseURL: 'https://api.siliconflow.cn/v1'
    }));

    // DeepSeek
    this.providers.set('deepseek', new DeepSeekProvider({
      apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    }));

    // Moonshot (Kimi)
    this.providers.set('moonshot', new MoonshotProvider({
      apiKey: import.meta.env.VITE_MOONSHOT_API_KEY,
      baseURL: 'https://api.moonshot.cn/v1'
    }));

    // 火山引擎 (豆包)
    this.providers.set('volcengine', new VolcengineProvider({
      apiKey: import.meta.env.VITE_VOLCENGINE_API_KEY,
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3'
    }));

    // 阿里云百炼
    this.providers.set('dashscope', new DashScopeProvider({
      apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY,
      baseURL: 'https://dashscope.aliyuncs.com/api/v1'
    }));

    // 本地部署 (Ollama)
    this.providers.set('local', new LocalProvider({
      baseURL: 'http://localhost:11434'
    }));
  }

  // 智能模型选择
  async generateContent(
    prompt: string, 
    config: LLMConfig, 
    context?: any
  ): Promise<LLMResponse> {
    try {
      // 1. 检查成本预算
      if (!this.costTracker.checkBudget(config.modelId)) {
        console.log(`Budget exceeded for ${config.modelId}, switching to fallback`);
        config.modelId = config.fallbackModel || 'deepseek-chat';
      }

      // 2. 检查模型可用性
      const provider = this.getProviderForModel(config.modelId);
      if (!provider || !await provider.isHealthy()) {
        console.log(`Provider unavailable for ${config.modelId}, using fallback`);
        config.modelId = config.fallbackModel || 'qwen2.5-7b-instruct';
      }

      // 3. 负载均衡
      const selectedProvider = this.loadBalancer.selectProvider(config.modelId);

      // 4. 生成内容
      const response = await selectedProvider.generate({
        model: config.modelId,
        prompt,
        systemPrompt: config.systemPrompt,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      });

      // 5. 记录成本和使用情况
      this.costTracker.recordUsage(config.modelId, response.usage, response.cost);

      return response;

    } catch (error) {
      console.error(`Error with primary model ${config.modelId}:`, error);
      
      // 自动降级到备用模型
      if (config.fallbackModel && config.fallbackModel !== config.modelId) {
        console.log(`Falling back to ${config.fallbackModel}`);
        return this.generateContent(prompt, {
          ...config,
          modelId: config.fallbackModel,
          fallbackModel: undefined // 避免无限递归
        }, context);
      }
      
      throw error;
    }
  }

  // 批量生成（成本优化）
  async batchGenerate(
    requests: Array<{ prompt: string; config: LLMConfig }>
  ): Promise<LLMResponse[]> {
    // 按模型分组
    const groupedRequests = this.groupRequestsByModel(requests);
    
    // 并行处理每个模型组
    const results = await Promise.allSettled(
      Object.entries(groupedRequests).map(([modelId, modelRequests]) =>
        this.processBatch(modelId, modelRequests)
      )
    );

    return this.flattenBatchResults(results);
  }

  // 获取模型性能统计
  getModelStats(modelId: string) {
    return {
      usage: this.costTracker.getUsageStats(modelId),
      performance: this.loadBalancer.getPerformanceStats(modelId),
      cost: this.costTracker.getCostStats(modelId)
    };
  }

  // 动态调整模型配置
  async optimizeConfig(agentId: string, contentType: string): Promise<LLMConfig> {
    const stats = this.getHistoricalPerformance(agentId, contentType);
    
    return {
      modelId: this.selectOptimalModel(stats),
      provider: this.selectOptimalProvider(stats),
      temperature: this.optimizeTemperature(stats),
      maxTokens: this.optimizeMaxTokens(stats),
      systemPrompt: await this.optimizeSystemPrompt(agentId, contentType, stats)
    };
  }

  private getProviderForModel(modelId: string): LLMProvider | null {
    for (const [providerId, provider] of this.providers) {
      if (provider.supportsModel(modelId)) {
        return provider;
      }
    }
    return null;
  }

  private groupRequestsByModel(requests: Array<{ prompt: string; config: LLMConfig }>) {
    const grouped: { [modelId: string]: Array<{ prompt: string; config: LLMConfig }> } = {};
    
    requests.forEach(request => {
      const modelId = request.config.modelId;
      if (!grouped[modelId]) {
        grouped[modelId] = [];
      }
      grouped[modelId].push(request);
    });
    
    return grouped;
  }

  private async processBatch(
    modelId: string, 
    requests: Array<{ prompt: string; config: LLMConfig }>
  ): Promise<LLMResponse[]> {
    const provider = this.getProviderForModel(modelId);
    if (!provider) {
      throw new Error(`No provider found for model ${modelId}`);
    }

    // 如果提供商支持批量处理，使用批量API
    if (provider.supportsBatch()) {
      return provider.batchGenerate(requests);
    }

    // 否则并发处理
    return Promise.all(
      requests.map(request => 
        this.generateContent(request.prompt, request.config)
      )
    );
  }

  private flattenBatchResults(results: PromiseSettledResult<LLMResponse[]>[]): LLMResponse[] {
    const flattened: LLMResponse[] = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        flattened.push(...result.value);
      } else {
        console.error('Batch processing error:', result.reason);
      }
    });
    
    return flattened;
  }

  private selectOptimalModel(stats: any): string {
    // 基于成本、质量、速度的综合评分选择最优模型
    const models = Object.keys(stats.modelPerformance || {});
    
    if (models.length === 0) return 'deepseek-chat';
    
    return models.reduce((best, current) => {
      const currentScore = this.calculateModelScore(stats.modelPerformance[current]);
      const bestScore = this.calculateModelScore(stats.modelPerformance[best]);
      
      return currentScore > bestScore ? current : best;
    });
  }

  private calculateModelScore(performance: any): number {
    if (!performance) return 0;
    
    // 综合评分算法：质量权重40%，成本权重35%，速度权重25%
    const qualityScore = (performance.averageQuality || 0) / 10; // 0-1
    const costScore = 1 - ((performance.averageCost || 0) / (performance.maxCost || 1)); // 0-1，成本越低分数越高
    const speedScore = 1 - ((performance.averageLatency || 0) / (performance.maxLatency || 1)); // 0-1，速度越快分数越高
    
    return qualityScore * 0.4 + costScore * 0.35 + speedScore * 0.25;
  }

  private getHistoricalPerformance(agentId: string, contentType: string) {
    // 从数据库获取历史性能数据
    return {
      modelPerformance: {},
      qualityMetrics: {},
      costMetrics: {},
      speedMetrics: {}
    };
  }

  private optimizeTemperature(stats: any): number {
    return 0.7; // 默认值
  }

  private optimizeMaxTokens(stats: any): number {
    return 2000; // 默认值
  }

  private async optimizeSystemPrompt(agentId: string, contentType: string, stats: any): Promise<string> {
    return `你是一个专业的${agentId}内容创作者，擅长创作${contentType}类型的内容。`;
  }

  private selectOptimalProvider(stats: any): string {
    return 'openrouter'; // 默认使用Openrouter
  }
}

// 成本追踪器
class CostTracker {
  private dailyBudgets: Map<string, number> = new Map();
  private currentUsage: Map<string, number> = new Map();
  private usageHistory: Array<UsageRecord> = [];

  checkBudget(modelId: string): boolean {
    const budget = this.dailyBudgets.get(modelId) || Infinity;
    const usage = this.currentUsage.get(modelId) || 0;
    return usage < budget;
  }

  recordUsage(modelId: string, usage: any, cost: number) {
    const currentUsage = this.currentUsage.get(modelId) || 0;
    this.currentUsage.set(modelId, currentUsage + cost);
    
    this.usageHistory.push({
      modelId,
      timestamp: new Date(),
      usage,
      cost
    });
  }

  getUsageStats(modelId: string) {
    return {
      dailyUsage: this.currentUsage.get(modelId) || 0,
      dailyBudget: this.dailyBudgets.get(modelId) || 0,
      utilizationRate: (this.currentUsage.get(modelId) || 0) / (this.dailyBudgets.get(modelId) || 1)
    };
  }

  getCostStats(modelId: string) {
    const records = this.usageHistory.filter(r => r.modelId === modelId);
    const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
    const avgCost = totalCost / records.length || 0;
    
    return {
      totalCost,
      avgCost,
      recordCount: records.length
    };
  }
}

// 负载均衡器
class LoadBalancer {
  private providerHealth: Map<string, HealthStatus> = new Map();
  private responseTimeHistory: Map<string, number[]> = new Map();

  selectProvider(modelId: string): LLMProvider {
    // 基于健康状态和响应时间选择最佳提供商
    const availableProviders = this.getAvailableProviders(modelId);
    
    if (availableProviders.length === 0) {
      throw new Error(`No available providers for model ${modelId}`);
    }
    
    return availableProviders.reduce((best, current) => {
      const currentScore = this.calculateProviderScore(current);
      const bestScore = this.calculateProviderScore(best);
      
      return currentScore > bestScore ? current : best;
    });
  }

  private getAvailableProviders(modelId: string): LLMProvider[] {
    // 返回支持该模型且健康的提供商列表
    return [];
  }

  private calculateProviderScore(provider: LLMProvider): number {
    // 基于健康状态、响应时间、负载等计算分数
    return Math.random(); // 简化实现
  }

  getPerformanceStats(modelId: string) {
    return {
      avgResponseTime: 0,
      successRate: 0,
      errorRate: 0
    };
  }
}

// 抽象LLM提供商基类
abstract class LLMProvider {
  protected config: any;

  constructor(config: any) {
    this.config = config;
  }

  abstract async generate(request: any): Promise<LLMResponse>;
  abstract async isHealthy(): boolean;
  abstract supportsModel(modelId: string): boolean;
  abstract supportsBatch(): boolean;
  abstract async batchGenerate(requests: any[]): Promise<LLMResponse[]>;
}

// Openrouter提供商 - 统一调用国外模型
class OpenrouterProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aims.example.com',
        'X-Title': 'AIMS - AI Content Matrix System'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature,
        max_tokens: request.maxTokens
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: request.model,
      cost: this.calculateCost(data.usage, request.model)
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: { 
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': 'https://aims.example.com'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      // OpenAI models via Openrouter
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'openai/gpt-4-turbo',
      'openai/gpt-3.5-turbo',
      // Anthropic models via Openrouter
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-haiku',
      'anthropic/claude-3-opus',
      // Google models via Openrouter
      'google/gemini-pro',
      'google/gemini-pro-vision',
      // Meta models via Openrouter
      'meta-llama/llama-3.2-3b-instruct',
      'meta-llama/llama-3.2-11b-instruct',
      // Mistral models via Openrouter
      'mistralai/mistral-7b-instruct',
      'mistralai/mixtral-8x7b-instruct'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false; // Openrouter不支持批量API
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }

  private calculateCost(usage: any, model: string): number {
    // Openrouter的定价会根据具体模型变化，这里使用估算
    const baseCost = 0.002; // 每1K token的基础成本
    return (usage.total_tokens * baseCost) / 1000;
  }
}

// 硅基流动提供商
class SiliconFlowProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature,
        max_tokens: request.maxTokens
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: request.model,
      cost: this.calculateCost(data.usage, request.model)
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      'Qwen/Qwen2.5-7B-Instruct',
      'Qwen/Qwen2.5-14B-Instruct',
      'Qwen/Qwen2.5-32B-Instruct',
      'Qwen/Qwen2.5-72B-Instruct',
      'deepseek-ai/DeepSeek-V2.5',
      'meta-llama/Meta-Llama-3.1-8B-Instruct',
      'meta-llama/Meta-Llama-3.1-70B-Instruct',
      'mistralai/Mistral-7B-Instruct-v0.3'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false;
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }

  private calculateCost(usage: any, model: string): number {
    // 硅基流动的定价相对便宜
    const costPer1kTokens = 0.0005;
    return (usage.total_tokens * costPer1kTokens) / 1000;
  }
}

// DeepSeek提供商
class DeepSeekProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature,
        max_tokens: request.maxTokens
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: request.model,
      cost: this.calculateCost(data.usage, request.model)
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      'deepseek-chat',
      'deepseek-coder'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false;
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }

  private calculateCost(usage: any, model: string): number {
    // DeepSeek的定价非常便宜
    const costPer1kTokens = 0.0002;
    return (usage.total_tokens * costPer1kTokens) / 1000;
  }
}

// Moonshot (Kimi) 提供商
class MoonshotProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature,
        max_tokens: request.maxTokens
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: request.model,
      cost: this.calculateCost(data.usage, request.model)
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      'moonshot-v1-8k',
      'moonshot-v1-32k',
      'moonshot-v1-128k'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false;
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }

  private calculateCost(usage: any, model: string): number {
    // Moonshot的定价
    const costPer1kTokens = 0.012; // 8k模型
    if (model.includes('32k')) return (usage.total_tokens * 0.024) / 1000;
    if (model.includes('128k')) return (usage.total_tokens * 0.06) / 1000;
    return (usage.total_tokens * costPer1kTokens) / 1000;
  }
}

// 火山引擎 (豆包) 提供商
class VolcengineProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature,
        max_tokens: request.maxTokens
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: request.model,
      cost: this.calculateCost(data.usage, request.model)
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      'doubao-lite-4k',
      'doubao-lite-32k',
      'doubao-lite-128k',
      'doubao-pro-4k',
      'doubao-pro-32k',
      'doubao-pro-128k'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false;
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }

  private calculateCost(usage: any, model: string): number {
    // 火山引擎的定价
    let costPer1kTokens = 0.0008; // lite版本
    if (model.includes('pro')) costPer1kTokens = 0.008;
    return (usage.total_tokens * costPer1kTokens) / 1000;
  }
}

// 阿里云百炼提供商
class DashScopeProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/services/aigc/text-generation/generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        input: {
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.prompt }
          ]
        },
        parameters: {
          temperature: request.temperature,
          max_tokens: request.maxTokens
        }
      })
    });

    const data = await response.json();
    
    return {
      content: data.output.text,
      usage: data.usage,
      model: request.model,
      cost: this.calculateCost(data.usage, request.model)
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      'qwen-turbo',
      'qwen-plus',
      'qwen-max',
      'qwen-max-longcontext',
      'qwen2.5-72b-instruct',
      'qwen2.5-32b-instruct',
      'qwen2.5-14b-instruct',
      'qwen2.5-7b-instruct'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false;
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }

  private calculateCost(usage: any, model: string): number {
    // 阿里云百炼的定价
    let costPer1kTokens = 0.002; // qwen-turbo
    if (model.includes('plus')) costPer1kTokens = 0.004;
    if (model.includes('max')) costPer1kTokens = 0.02;
    return (usage.total_tokens * costPer1kTokens) / 1000;
  }
}

// 本地部署提供商 (Ollama)
class LocalProvider extends LLMProvider {
  async generate(request: any): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseURL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        prompt: `${request.systemPrompt}\n\nUser: ${request.prompt}\nAssistant:`,
        stream: false,
        options: {
          temperature: request.temperature,
          num_predict: request.maxTokens
        }
      })
    });

    const data = await response.json();
    
    return {
      content: data.response,
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      },
      model: request.model,
      cost: 0 // 本地部署无成本
    };
  }

  async isHealthy(): boolean {
    try {
      const response = await fetch(`${this.config.baseURL}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsModel(modelId: string): boolean {
    const supportedModels = [
      'qwen2.5:7b',
      'qwen2.5:14b',
      'llama3.2:3b',
      'llama3.2:1b',
      'gemma2:9b',
      'mistral:7b'
    ];
    return supportedModels.includes(modelId);
  }

  supportsBatch(): boolean {
    return false;
  }

  async batchGenerate(requests: any[]): Promise<LLMResponse[]> {
    return Promise.all(requests.map(req => this.generate(req)));
  }
}

interface UsageRecord {
  modelId: string;
  timestamp: Date;
  usage: any;
  cost: number;
}

interface HealthStatus {
  isHealthy: boolean;
  lastCheck: Date;
  responseTime: number;
}

export const llmService = new LLMService();