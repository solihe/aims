// LLM模型选择器组件
import React from 'react';
import { useLLMStore } from '../../stores/useLLMStore';
import { LLMProvider, AVAILABLE_MODELS } from '../../types/llm';
import { Brain, Zap, DollarSign, Clock } from 'lucide-react';

interface LLMSelectorProps {
  selectedConfigId?: string;
  onConfigSelect: (configId: string) => void;
  showDetails?: boolean;
}

export const LLMSelector: React.FC<LLMSelectorProps> = ({
  selectedConfigId,
  onConfigSelect,
  showDetails = false
}) => {
  const { configs, getActiveConfigs, getDefaultConfig } = useLLMStore();
  
  const activeConfigs = getActiveConfigs();
  const defaultConfig = getDefaultConfig();
  
  // 如果没有选择配置，使用默认配置
  const currentConfigId = selectedConfigId || defaultConfig?.id || '';

  const getProviderIcon = (provider: LLMProvider) => {
    const icons = {
      [LLMProvider.OPENAI]: '🤖',
      [LLMProvider.GEMINI]: '💎',
      [LLMProvider.DEEPSEEK]: '🔍',
      [LLMProvider.MOONSHOT]: '🌙',
      [LLMProvider.OPENROUTER]: '🔀'
    };
    return icons[provider];
  };

  const getProviderName = (provider: LLMProvider) => {
    const names = {
      [LLMProvider.OPENAI]: 'OpenAI',
      [LLMProvider.GEMINI]: 'Gemini',
      [LLMProvider.DEEPSEEK]: 'DeepSeek',
      [LLMProvider.MOONSHOT]: 'Moonshot',
      [LLMProvider.OPENROUTER]: 'OpenRouter'
    };
    return names[provider];
  };

  const getModelInfo = (provider: LLMProvider, modelId: string) => {
    return AVAILABLE_MODELS[provider]?.find(model => model.id === modelId);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}/1K`;
  };

  if (activeConfigs.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              没有可用的LLM配置
            </p>
            <p className="text-xs text-yellow-600">
              请先在LLM设置中配置至少一个AI模型
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        选择AI模型
      </label>
      
      <div className="space-y-2">
        {activeConfigs.map((config) => {
          const modelInfo = getModelInfo(config.provider, config.model);
          const isSelected = config.id === currentConfigId;
          
          return (
            <div
              key={config.id}
              onClick={() => onConfigSelect(config.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getProviderIcon(config.provider)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {config.modelName || getProviderName(config.provider)}
                      </span>
                      {config.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          默认
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {modelInfo?.name || config.model}
                    </p>
                    {config.modelName && (
                      <p className="text-xs text-gray-500">
                        {getProviderName(config.provider)}
                      </p>
                    )}
                  </div>
                </div>

                {showDetails && modelInfo && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{modelInfo.contextLength.toLocaleString()}K</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{formatPrice(modelInfo.inputPrice)}</span>
                    </div>
                  </div>
                )}
              </div>

              {showDetails && modelInfo && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {modelInfo.capabilities.slice(0, 3).map((capability) => (
                      <span
                        key={capability}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {capability}
                      </span>
                    ))}
                    {modelInfo.capabilities.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +{modelInfo.capabilities.length - 3}
                      </span>
                    )}
                  </div>
                  {modelInfo.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {modelInfo.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 快速配置提示 */}
      <div className="text-xs text-gray-500">
        <p>
          💡 提示：可以在 
          <button 
            onClick={() => window.location.hash = '#llm-settings'}
            className="text-blue-600 hover:text-blue-800 underline mx-1"
          >
            LLM设置
          </button> 
          中添加更多模型配置
        </p>
      </div>
    </div>
  );
};
