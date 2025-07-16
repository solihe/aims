import React, { useState } from 'react';
import { Brain, Zap, DollarSign, Settings, Plus, Edit2, Trash2, BarChart3 } from 'lucide-react';

interface LLMProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'local' | 'opensource';
  models: LLMModel[];
  costPerToken: number;
  apiEndpoint?: string;
  status: 'active' | 'inactive' | 'error';
}

interface LLMModel {
  id: string;
  name: string;
  contextLength: number;
  costPer1kTokens: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'high' | 'medium' | 'low';
  specialties: string[];
}

interface AgentLLMConfig {
  agentId: string;
  agentName: string;
  contentTypes: {
    [key: string]: {
      primaryModel: string;
      fallbackModel: string;
      temperature: number;
      maxTokens: number;
      systemPrompt: string;
    };
  };
  costBudget: {
    daily: number;
    monthly: number;
    current: number;
  };
}

const LLMConfig = () => {
  const [selectedAgent, setSelectedAgent] = useState('twitter');
  
  const llmProviders: LLMProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'openai',
      costPerToken: 0.002,
      status: 'active',
      models: [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          contextLength: 128000,
          costPer1kTokens: 0.005,
          speed: 'medium',
          quality: 'high',
          specialties: ['创意写作', '深度分析', '多语言']
        },
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          contextLength: 128000,
          costPer1kTokens: 0.00015,
          speed: 'fast',
          quality: 'medium',
          specialties: ['快速生成', '简短内容', '成本优化']
        }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      type: 'anthropic',
      costPerToken: 0.003,
      status: 'active',
      models: [
        {
          id: 'claude-3-5-sonnet',
          name: 'Claude 3.5 Sonnet',
          contextLength: 200000,
          costPer1kTokens: 0.003,
          speed: 'medium',
          quality: 'high',
          specialties: ['逻辑推理', '代码生成', '长文写作']
        },
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          contextLength: 200000,
          costPer1kTokens: 0.00025,
          speed: 'fast',
          quality: 'medium',
          specialties: ['快速响应', '简洁表达', '成本效益']
        }
      ]
    },
    {
      id: 'local',
      name: '本地部署',
      type: 'local',
      costPerToken: 0.0001,
      status: 'active',
      models: [
        {
          id: 'qwen2.5-7b',
          name: 'Qwen2.5-7B',
          contextLength: 32768,
          costPer1kTokens: 0.0001,
          speed: 'fast',
          quality: 'medium',
          specialties: ['中文优化', '本地部署', '隐私保护']
        },
        {
          id: 'llama-3.2-3b',
          name: 'Llama 3.2 3B',
          contextLength: 8192,
          costPer1kTokens: 0.00005,
          speed: 'fast',
          quality: 'low',
          specialties: ['轻量级', '极低成本', '快速生成']
        }
      ]
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      type: 'opensource',
      costPerToken: 0.0002,
      status: 'active',
      models: [
        {
          id: 'deepseek-chat',
          name: 'DeepSeek Chat',
          contextLength: 64000,
          costPer1kTokens: 0.0002,
          speed: 'medium',
          quality: 'medium',
          specialties: ['中文对话', '成本优化', '技术内容']
        }
      ]
    }
  ];

  const agentConfigs: AgentLLMConfig[] = [
    {
      agentId: 'weibo',
      agentName: '微博Agent',
      contentTypes: {
        'hot-topic-comment': {
          primaryModel: 'gpt-4o-mini',
          fallbackModel: 'qwen2.5-7b',
          temperature: 0.8,
          maxTokens: 140,
          systemPrompt: '你是一个专业的微博内容创作者，擅长创作热点话题评论，语言简洁有力，观点鲜明。'
        },
        'industry-insight': {
          primaryModel: 'claude-3-5-sonnet',
          fallbackModel: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 500,
          systemPrompt: '你是一个行业专家，擅长在微博上分享有深度的行业洞察，吸引专业人士关注。'
        },
        'interactive-topic': {
          primaryModel: 'gpt-4o',
          fallbackModel: 'claude-3-haiku',
          temperature: 0.9,
          maxTokens: 200,
          systemPrompt: '你是一个善于制造话题的微博博主，擅长创作引发讨论和互动的内容。'
        }
      },
      costBudget: {
        daily: 15,
        monthly: 450,
        current: 3.8
      }
    },
    {
      agentId: 'xiaohongshu',
      agentName: '小红书Agent',
      contentTypes: {
        'lifestyle-sharing': {
          primaryModel: 'gpt-4o',
          fallbackModel: 'qwen2.5-7b',
          temperature: 0.8,
          maxTokens: 1000,
          systemPrompt: '你是一个小红书博主，擅长创作生活化、实用的种草内容，语言亲切自然。'
        },
        'tool-review': {
          primaryModel: 'claude-3-5-sonnet',
          fallbackModel: 'gpt-4o-mini',
          temperature: 0.6,
          maxTokens: 800,
          systemPrompt: '你是一个专业的工具测评师，在小红书上分享详细的产品体验和使用心得。'
        },
        'tutorial-guide': {
          primaryModel: 'gpt-4o-mini',
          fallbackModel: 'deepseek-chat',
          temperature: 0.7,
          maxTokens: 1200,
          systemPrompt: '你是一个教程创作者，擅长在小红书上分享简单易懂的操作指南和技巧。'
        }
      },
      costBudget: {
        daily: 12,
        monthly: 360,
        current: 4.2
      }
    },
    {
      agentId: 'zhihu',
      agentName: '知乎Agent',
      contentTypes: {
        'professional-answer': {
          primaryModel: 'claude-3-5-sonnet',
          fallbackModel: 'gpt-4o',
          temperature: 0.5,
          maxTokens: 5000,
          systemPrompt: '你是一个知乎专业答主，擅长提供深度、专业、有见解的回答，逻辑清晰，论证有力。'
        },
        'industry-analysis': {
          primaryModel: 'gpt-4o',
          fallbackModel: 'claude-3-5-sonnet',
          temperature: 0.4,
          maxTokens: 8000,
          systemPrompt: '你是一个行业分析专家，在知乎上发表深度的行业分析文章，数据详实，观点独到。'
        },
        'experience-sharing': {
          primaryModel: 'gpt-4o-mini',
          fallbackModel: 'qwen2.5-7b',
          temperature: 0.7,
          maxTokens: 3000,
          systemPrompt: '你是一个经验丰富的从业者，在知乎上分享实用的工作经验和人生感悟。'
        }
      },
      costBudget: {
        daily: 20,
        monthly: 600,
        current: 12.5
      }
    },
    {
      agentId: 'douyin',
      agentName: '抖音Agent',
      contentTypes: {
        'knowledge-sharing': {
          primaryModel: 'gpt-4o-mini',
          fallbackModel: 'qwen2.5-7b',
          temperature: 0.8,
          maxTokens: 500,
          systemPrompt: '你是一个抖音知识博主，擅长创作简短有趣的知识科普视频脚本，语言生动易懂。'
        },
        'tool-demo': {
          primaryModel: 'claude-3-haiku',
          fallbackModel: 'deepseek-chat',
          temperature: 0.7,
          maxTokens: 400,
          systemPrompt: '你是一个工具演示专家，在抖音上展示各种实用工具的使用方法，简洁明了。'
        },
        'trend-analysis': {
          primaryModel: 'gpt-4o',
          fallbackModel: 'qwen2.5-7b',
          temperature: 0.9,
          maxTokens: 600,
          systemPrompt: '你是一个趋势观察者，在抖音上解读最新的行业趋势，内容新颖有趣。'
        }
      },
      costBudget: {
        daily: 8,
        monthly: 240,
        current: 2.1
      }
    },
    {
      agentId: 'linkedin',
      agentName: 'LinkedIn Agent',
      contentTypes: {
        'professional-post': {
          primaryModel: 'claude-3-5-sonnet',
          fallbackModel: 'gpt-4o',
          temperature: 0.6,
          maxTokens: 3000,
          systemPrompt: '你是一个资深的行业专家，擅长撰写专业、有洞察力的LinkedIn内容。'
        },
        'industry-analysis': {
          primaryModel: 'gpt-4o',
          fallbackModel: 'claude-3-5-sonnet',
          temperature: 0.5,
          maxTokens: 5000,
          systemPrompt: '你是一个行业分析师，能够深度分析行业趋势，提供有价值的洞察。'
        },
        'career-advice': {
          primaryModel: 'claude-3-haiku',
          fallbackModel: 'deepseek-chat',
          temperature: 0.7,
          maxTokens: 2000,
          systemPrompt: '你是一个职场导师，擅长给出实用的职业建议和成长指导。'
        }
      },
      costBudget: {
        daily: 15,
        monthly: 450,
        current: 8.2
      }
    },
    {
      agentId: 'tiktok',
      agentName: 'TikTok Agent',
      contentTypes: {
        'short-script': {
          primaryModel: 'gpt-4o-mini',
          fallbackModel: 'qwen2.5-7b',
          temperature: 0.9,
          maxTokens: 500,
          systemPrompt: '你是一个创意十足的短视频编剧，擅长创作吸引人的短视频脚本。'
        },
        'trend-follow': {
          primaryModel: 'llama-3.2-3b',
          fallbackModel: 'deepseek-chat',
          temperature: 1.0,
          maxTokens: 300,
          systemPrompt: '你是一个紧跟潮流的内容创作者，能够快速适应和创作热门趋势内容。'
        }
      },
      costBudget: {
        daily: 5,
        monthly: 150,
        current: 1.8
      }
    }
  ];

  const currentConfig = agentConfigs.find(config => config.agentId === selectedAgent);

  const getModelInfo = (modelId: string) => {
    for (const provider of llmProviders) {
      const model = provider.models.find(m => m.id === modelId);
      if (model) return { model, provider };
    }
    return null;
  };

  const getQualityColor = (quality: string) => {
    switch(quality) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSpeedColor = (speed: string) => {
    switch(speed) {
      case 'fast': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'slow': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM 配置中心</h1>
          <p className="text-gray-600">为每个Agent配置最适合的LLM模型，实现成本优化和风格多样化</p>
        </div>

        {/* 成本概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">今日总成本</p>
                <p className="text-2xl font-bold text-gray-900">$12.5</p>
                <p className="text-xs text-green-600">预算内 83%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">活跃模型</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-blue-600">跨4个提供商</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">今日调用</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-purple-600">+15% vs 昨日</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">平均质量</p>
                <p className="text-2xl font-bold text-gray-900">8.7/10</p>
                <p className="text-xs text-orange-600">质量稳定</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Agent选择 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">选择Agent</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {agentConfigs.map((config) => (
                    <button
                      key={config.agentId}
                      onClick={() => setSelectedAgent(config.agentId)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedAgent === config.agentId 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{config.agentName}</h4>
                        <span className="text-xs text-gray-500">
                          ${config.costBudget.current}/${config.costBudget.daily}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {Object.keys(config.contentTypes).length} 种内容类型
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${(config.costBudget.current / config.costBudget.daily) * 100}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 配置详情 */}
          <div className="lg:col-span-3">
            {currentConfig && (
              <div className="space-y-6">
                {/* Agent配置概览 */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{currentConfig.agentName} 配置</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        保存配置
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">日预算</p>
                        <p className="text-xl font-bold text-gray-900">${currentConfig.costBudget.daily}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">已使用</p>
                        <p className="text-xl font-bold text-gray-900">${currentConfig.costBudget.current}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">使用率</p>
                        <p className="text-xl font-bold text-gray-900">
                          {((currentConfig.costBudget.current / currentConfig.costBudget.daily) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 内容类型配置 */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">内容类型配置</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {Object.entries(currentConfig.contentTypes).map(([contentType, config]) => {
                        const primaryModelInfo = getModelInfo(config.primaryModel);
                        const fallbackModelInfo = getModelInfo(config.fallbackModel);
                        
                        return (
                          <div key={contentType} className="border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-medium text-gray-900 capitalize">
                                {contentType.replace('-', ' ')}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* 主模型 */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">主模型</label>
                                <div className="border rounded-lg p-4 bg-green-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">
                                      {primaryModelInfo?.model.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {primaryModelInfo?.provider.name}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <span className="text-gray-500">质量: </span>
                                      <span className={getQualityColor(primaryModelInfo?.model.quality || '')}>
                                        {primaryModelInfo?.model.quality}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">速度: </span>
                                      <span className={getSpeedColor(primaryModelInfo?.model.speed || '')}>
                                        {primaryModelInfo?.model.speed}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">成本: </span>
                                      <span className="text-green-600">
                                        ${primaryModelInfo?.model.costPer1kTokens}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <div className="flex flex-wrap gap-1">
                                      {primaryModelInfo?.model.specialties.map((specialty, index) => (
                                        <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                          {specialty}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 备用模型 */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">备用模型</label>
                                <div className="border rounded-lg p-4 bg-yellow-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">
                                      {fallbackModelInfo?.model.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {fallbackModelInfo?.provider.name}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <span className="text-gray-500">质量: </span>
                                      <span className={getQualityColor(fallbackModelInfo?.model.quality || '')}>
                                        {fallbackModelInfo?.model.quality}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">速度: </span>
                                      <span className={getSpeedColor(fallbackModelInfo?.model.speed || '')}>
                                        {fallbackModelInfo?.model.speed}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">成本: </span>
                                      <span className="text-green-600">
                                        ${fallbackModelInfo?.model.costPer1kTokens}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 参数配置 */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={config.temperature}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-500">{config.temperature}</span>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                                <input
                                  type="number"
                                  value={config.maxTokens}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              <div className="flex items-end">
                                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                                  测试配置
                                </button>
                              </div>
                            </div>

                            {/* 系统提示词 */}
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">系统提示词</label>
                              <textarea
                                value={config.systemPrompt}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 模型提供商状态 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">模型提供商状态</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {llmProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      provider.status === 'active' ? 'bg-green-500' : 
                      provider.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      模型数量: {provider.models.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      平均成本: ${provider.costPerToken}/token
                    </div>
                    <div className="text-xs text-gray-500">
                      类型: {provider.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMConfig;