// LLM API 设置组件
import React, { useState, useEffect } from 'react';
import { useLLMStore } from '../../stores/useLLMStore';
import { LLMProvider, LLMConfig, AVAILABLE_MODELS, API_ENDPOINTS } from '../../types/llm';
import {
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Zap,
  DollarSign,
  Clock,
  Activity,
  Edit3,
  Save,
  X
} from 'lucide-react';

export const LLMSettings: React.FC = () => {
  const {
    configs,
    usageStats,
    isLoading,
    error,
    addConfig,
    updateConfig,
    deleteConfig,
    setDefaultConfig,
    toggleConfigActive,
    testConnection,
    loadConfigs,
    clearError
  } = useLLMStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const [newConfig, setNewConfig] = useState({
    provider: LLMProvider.OPENAI,
    model: 'gpt-4o-mini',
    modelName: '',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
    isActive: true
  });

  const [editingConfig, setEditingConfig] = useState<LLMConfig | null>(null);

  const handleAddConfig = () => {
    if (!newConfig.apiKey.trim()) {
      alert('请输入API Key');
      return;
    }

    addConfig(newConfig);

    setNewConfig({
      provider: LLMProvider.OPENAI,
      model: 'gpt-4o-mini',
      modelName: '',
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      temperature: 0.7,
      maxTokens: 4000,
      isDefault: false,
      isActive: true
    });
    setShowAddForm(false);
  };

  const handleTestConnection = async (id: string) => {
    const success = await testConnection(id);
    if (success) {
      alert('连接测试成功！');
    }
  };

  const handleEditConfig = (config: LLMConfig) => {
    setEditingConfig({ ...config });
  };

  const handleSaveEdit = () => {
    if (editingConfig) {
      updateConfig(editingConfig.id, editingConfig);
      setEditingConfig(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
  };

  const toggleApiKeyVisibility = (configId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

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
      [LLMProvider.GEMINI]: 'Google Gemini',
      [LLMProvider.DEEPSEEK]: 'DeepSeek',
      [LLMProvider.MOONSHOT]: 'Moonshot AI',
      [LLMProvider.OPENROUTER]: 'OpenRouter'
    };
    return names[provider];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">LLM API 设置</h1>
        </div>
        <p className="text-gray-600">
          配置和管理不同的AI模型服务，支持OpenAI、Gemini、DeepSeek、Moonshot和OpenRouter
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm underline mt-1"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">活跃配置</p>
              <p className="text-2xl font-bold text-gray-900">
                {configs.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">总请求数</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageStats.reduce((sum, stat) => sum + stat.totalRequests, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">总花费</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(usageStats.reduce((sum, stat) => sum + stat.totalCost, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">平均响应</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageStats.length > 0 
                  ? Math.round(usageStats.reduce((sum, stat) => sum + stat.averageResponseTime, 0) / usageStats.length)
                  : 0}ms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 配置列表 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">API 配置</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>添加配置</span>
            </button>
          </div>
        </div>

        <div className="divide-y">
          {configs.map((config) => {
            const isEditing = editingConfig?.id === config.id;

            return (
              <div key={config.id} className="p-6">
                {isEditing ? (
                  // 编辑模式
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">编辑配置</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:text-green-800"
                          title="保存"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-600 hover:text-gray-800"
                          title="取消"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          自定义名称
                        </label>
                        <input
                          type="text"
                          value={editingConfig.modelName || ''}
                          onChange={(e) => setEditingConfig(prev => prev ? { ...prev, modelName: e.target.value } : null)}
                          placeholder="留空使用默认名称"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          模型ID
                        </label>
                        <input
                          type="text"
                          value={editingConfig.model}
                          onChange={(e) => setEditingConfig(prev => prev ? { ...prev, model: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={editingConfig.apiKey}
                          onChange={(e) => setEditingConfig(prev => prev ? { ...prev, apiKey: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API URL
                        </label>
                        <input
                          type="url"
                          value={editingConfig.baseUrl}
                          onChange={(e) => setEditingConfig(prev => prev ? { ...prev, baseUrl: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          温度
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={editingConfig.temperature}
                          onChange={(e) => setEditingConfig(prev => prev ? { ...prev, temperature: parseFloat(e.target.value) } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          最大Token
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="32000"
                          value={editingConfig.maxTokens}
                          onChange={(e) => setEditingConfig(prev => prev ? { ...prev, maxTokens: parseInt(e.target.value) } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getProviderIcon(config.provider)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {config.modelName || getProviderName(config.provider)}
                            </h3>
                            {config.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                默认
                              </span>
                            )}
                            {config.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            模型: {config.model} | 温度: {config.temperature} | 最大Token: {config.maxTokens}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            URL: {config.baseUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleApiKeyVisibility(config.id)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title={showApiKeys[config.id] ? '隐藏API Key' : '显示API Key'}
                        >
                          {showApiKeys[config.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleTestConnection(config.id)}
                          disabled={isLoading}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                        >
                          {isLoading ? '测试中...' : '测试连接'}
                        </button>

                        <button
                          onClick={() => handleEditConfig(config)}
                          className="p-2 text-blue-400 hover:text-blue-600"
                          title="编辑配置"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDefaultConfig(config.id)}
                          disabled={config.isDefault}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                        >
                          设为默认
                        </button>

                        <button
                          onClick={() => toggleConfigActive(config.id)}
                          className={`px-3 py-1 text-sm rounded ${
                            config.isActive
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {config.isActive ? '停用' : '启用'}
                        </button>

                        <button
                          onClick={() => deleteConfig(config.id)}
                          className="p-2 text-red-400 hover:text-red-600"
                          title="删除配置"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* API Key 显示 */}
                    {showApiKeys[config.id] && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">API Key:</p>
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                          {config.apiKey}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {configs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>还没有配置任何LLM服务</p>
              <p className="text-sm">点击"添加配置"开始设置</p>
            </div>
          )}
        </div>
      </div>

      {/* 添加配置表单 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">添加LLM配置</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  服务提供商
                </label>
                <select
                  value={newConfig.provider}
                  onChange={(e) => {
                    const provider = e.target.value as LLMProvider;
                    const firstModel = AVAILABLE_MODELS[provider][0];
                    setNewConfig(prev => ({
                      ...prev,
                      provider,
                      model: firstModel.id,
                      baseUrl: API_ENDPOINTS?.[provider] || 'https://api.openai.com/v1'
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(LLMProvider).map(provider => (
                    <option key={provider} value={provider}>
                      {getProviderName(provider)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  自定义名称（可选）
                </label>
                <input
                  type="text"
                  value={newConfig.modelName}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, modelName: e.target.value }))}
                  placeholder="留空使用默认名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  模型ID
                </label>
                <div className="flex space-x-2">
                  <select
                    value={newConfig.model}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {AVAILABLE_MODELS[newConfig.provider].map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newConfig.model}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="或输入自定义模型ID"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  可以从下拉选择预设模型，或在右侧输入框填写自定义模型ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={newConfig.apiKey}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="输入API Key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API URL
                </label>
                <input
                  type="url"
                  value={newConfig.baseUrl}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder="API端点URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  默认使用官方API地址，可自定义代理或私有部署地址
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    温度
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={newConfig.temperature}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最大Token
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="32000"
                    value={newConfig.maxTokens}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newConfig.isDefault}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">设为默认</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newConfig.isActive}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">立即启用</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleAddConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                添加配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
