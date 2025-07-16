// LLM服务 - 统一的AI模型调用接口
import axios, { AxiosInstance } from 'axios';
import { LLMConfig, LLMProvider, LLMRequest, LLMResponse } from '../../types/llm';

class LLMService {
  private clients: Map<string, AxiosInstance> = new Map();

  // 创建HTTP客户端
  private createClient(config: LLMConfig): AxiosInstance {
    const client = axios.create({
      baseURL: config.baseUrl,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 根据不同提供商设置认证头
    this.setAuthHeaders(client, config);

    return client;
  }

  // 设置认证头
  private setAuthHeaders(client: AxiosInstance, config: LLMConfig) {
    switch (config.provider) {
      case LLMProvider.OPENAI:
        client.defaults.headers['Authorization'] = `Bearer ${config.apiKey}`;
        break;
      
      case LLMProvider.GEMINI:
        // Gemini使用查询参数传递API Key
        client.interceptors.request.use((requestConfig) => {
          requestConfig.params = { ...requestConfig.params, key: config.apiKey };
          return requestConfig;
        });
        break;
      
      case LLMProvider.DEEPSEEK:
      case LLMProvider.MOONSHOT:
        client.defaults.headers['Authorization'] = `Bearer ${config.apiKey}`;
        break;
      
      case LLMProvider.OPENROUTER:
        client.defaults.headers['Authorization'] = `Bearer ${config.apiKey}`;
        client.defaults.headers['HTTP-Referer'] = 'https://aims.example.com';
        client.defaults.headers['X-Title'] = 'AIMS - AI Marketing System';
        break;
    }
  }

  // 获取或创建客户端
  private getClient(config: LLMConfig): AxiosInstance {
    const clientKey = `${config.provider}-${config.id}`;
    
    if (!this.clients.has(clientKey)) {
      const client = this.createClient(config);
      this.clients.set(clientKey, client);
    }
    
    return this.clients.get(clientKey)!;
  }

  // 统一的聊天完成接口
  async chatCompletion(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    const client = this.getClient(config);

    try {
      let response;
      
      switch (config.provider) {
        case LLMProvider.OPENAI:
        case LLMProvider.DEEPSEEK:
        case LLMProvider.MOONSHOT:
        case LLMProvider.OPENROUTER:
          response = await this.callOpenAICompatible(client, config, request);
          break;
        
        case LLMProvider.GEMINI:
          response = await this.callGemini(client, config, request);
          break;
        
        default:
          throw new Error(`不支持的提供商: ${config.provider}`);
      }

      const responseTime = Date.now() - startTime;

      return {
        content: response.content,
        usage: response.usage,
        model: config.model,
        provider: config.provider,
        responseTime,
      };
    } catch (error) {
      console.error(`LLM调用失败 (${config.provider}):`, error);
      throw this.handleError(error, config.provider);
    }
  }

  // OpenAI兼容接口调用
  private async callOpenAICompatible(
    client: AxiosInstance, 
    config: LLMConfig, 
    request: LLMRequest
  ) {
    const messages = [];
    
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    
    messages.push({ role: 'user', content: request.prompt });

    const response = await client.post('/chat/completions', {
      model: config.model,
      messages,
      temperature: request.temperature ?? config.temperature,
      max_tokens: request.maxTokens ?? config.maxTokens,
      top_p: config.topP,
      frequency_penalty: config.frequencyPenalty,
      presence_penalty: config.presencePenalty,
      stream: request.stream ?? false,
    });

    const choice = response.data.choices[0];
    
    return {
      content: choice.message.content,
      usage: {
        promptTokens: response.data.usage.prompt_tokens,
        completionTokens: response.data.usage.completion_tokens,
        totalTokens: response.data.usage.total_tokens,
      },
    };
  }

  // Gemini API调用
  private async callGemini(
    client: AxiosInstance, 
    config: LLMConfig, 
    request: LLMRequest
  ) {
    const parts = [];
    
    if (request.systemPrompt) {
      parts.push({ text: `System: ${request.systemPrompt}\n\nUser: ${request.prompt}` });
    } else {
      parts.push({ text: request.prompt });
    }

    const response = await client.post(`/models/${config.model}:generateContent`, {
      contents: [{
        parts
      }],
      generationConfig: {
        temperature: request.temperature ?? config.temperature,
        maxOutputTokens: request.maxTokens ?? config.maxTokens,
        topP: config.topP,
      },
    });

    const candidate = response.data.candidates[0];
    
    return {
      content: candidate.content.parts[0].text,
      usage: {
        promptTokens: response.data.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.data.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  // 生成内容接口（简化版本）
  async generateContent(request: {
    messages: Array<{ role: string; content: string }>;
    config: LLMConfig;
  }): Promise<{ content: string }> {
    // 转换为LLMRequest格式
    const systemMessage = request.messages.find(m => m.role === 'system');
    const userMessage = request.messages.find(m => m.role === 'user');

    const llmRequest: LLMRequest = {
      prompt: userMessage?.content || '',
      systemPrompt: systemMessage?.content,
      maxTokens: request.config.maxTokens,
      temperature: request.config.temperature
    };

    const response = await this.chatCompletion(request.config, llmRequest);
    return { content: response.content };
  }

  // 测试连接
  async testConnection(config: LLMConfig): Promise<boolean> {
    try {
      const testRequest: LLMRequest = {
        prompt: 'Hello, this is a connection test.',
        maxTokens: 10,
        temperature: 0.1,
      };

      await this.chatCompletion(config, testRequest);
      return true;
    } catch (error) {
      console.error('连接测试失败:', error);
      return false;
    }
  }

  // 错误处理
  private handleError(error: any, provider: LLMProvider): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;

      switch (status) {
        case 401:
          return new Error(`${provider} API Key无效或已过期`);
        case 403:
          return new Error(`${provider} API访问被拒绝，请检查权限`);
        case 429:
          return new Error(`${provider} API请求频率超限，请稍后重试`);
        case 500:
          return new Error(`${provider} 服务器内部错误`);
        default:
          return new Error(`${provider} API调用失败: ${message}`);
      }
    }

    return new Error(`${provider} 未知错误: ${error.message}`);
  }

  // 清理客户端缓存
  clearClients() {
    this.clients.clear();
  }

  // 获取模型信息
  async getModelInfo(config: LLMConfig) {
    const client = this.getClient(config);
    
    try {
      switch (config.provider) {
        case LLMProvider.OPENAI:
        case LLMProvider.OPENROUTER:
          const response = await client.get('/models');
          return response.data.data.find((model: any) => model.id === config.model);
        
        default:
          return null;
      }
    } catch (error) {
      console.error('获取模型信息失败:', error);
      return null;
    }
  }
}

export const llmService = new LLMService();
