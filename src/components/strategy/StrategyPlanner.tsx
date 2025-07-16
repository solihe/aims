// AIMS 策略规划组件
import React, { useState } from 'react';
import { useStrategyStore } from '../../stores/useStrategyStore';
import { useAppStore } from '../../stores/useAppStore';
import { useLLMStore } from '../../stores/useLLMStore';
import { LLMSelector } from '../llm/LLMSelector';
import { MarketingIntent, MarketingObjective } from '../../types';
import { Target, Calendar, Users, MessageSquare, Zap } from 'lucide-react';

export const StrategyPlanner: React.FC = () => {
  const { createStrategy, isCreating, currentStrategy, setCurrentStrategy } = useStrategyStore();
  const { setError, setLoading } = useAppStore();
  const { getDefaultConfig } = useLLMStore();
  
  const [selectedLLMConfigId, setSelectedLLMConfigId] = useState<string>('');

  const [intent, setIntent] = useState<Partial<MarketingIntent>>({
    objective: MarketingObjective.PRODUCT_LAUNCH,
    description: '',
    targetAudience: {
      demographics: [],
      psychographics: [],
      platforms: []
    },
    keyMessages: [],
    timeline: {
      urgency: 'normal',
      duration: 4
    },
    constraints: {
      budget: 'medium',
      resources: 'adequate'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!intent.description?.trim()) {
      setError('请输入营销目标描述');
      return;
    }

    try {
      setLoading(true);
      const strategy = await createStrategy(intent as MarketingIntent);
      console.log('生成的策略:', strategy);
      console.log('使用的反面提示词:', intent.negativePrompts || '无');
      console.log('使用的LLM配置ID:', selectedLLMConfigId || '默认配置');
      setError(null);
      // 切换到编排视图
      // TODO: 实现视图切换
    } catch (error) {
      setError(error instanceof Error ? error.message : '策略创建失败');
    } finally {
      setLoading(false);
    }
  };

  const objectiveOptions = [
    { value: MarketingObjective.PRODUCT_LAUNCH, label: '产品发布', icon: Zap },
    { value: MarketingObjective.BRAND_BUILDING, label: '品牌建设', icon: Target },
    { value: MarketingObjective.LEAD_GENERATION, label: '线索获取', icon: Users },
    { value: MarketingObjective.SALES_CONVERSION, label: '销售转化', icon: MessageSquare },
    { value: MarketingObjective.CRISIS_MANAGEMENT, label: '危机管理', icon: Calendar }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">制定营销策略</h2>
          <p className="text-gray-600 mt-2">
            描述您的营销目标，AI将为您制定完整的跨平台传播战略
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 营销目标选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              营销目标
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {objectiveOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIntent(prev => ({ ...prev, objective: value }))}
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    intent.objective === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 目标描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              详细描述您的营销目标
            </label>
            <textarea
              id="description"
              rows={4}
              value={intent.description}
              onChange={(e) => setIntent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="例如：我们要发布新的AI产品，目标是在4周内建立行业权威地位，主要受众是产品经理和技术决策者..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 时间线设置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                紧急程度
              </label>
              <select
                value={intent.timeline?.urgency}
                onChange={(e) => setIntent(prev => ({
                  ...prev,
                  timeline: { ...prev.timeline!, urgency: e.target.value as any }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediate">立即执行</option>
                <option value="normal">正常安排</option>
                <option value="long_term">长期规划</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                传播周期（周）
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={intent.timeline?.duration}
                onChange={(e) => setIntent(prev => ({
                  ...prev,
                  timeline: { ...prev.timeline!, duration: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 资源约束 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预算水平
              </label>
              <select
                value={intent.constraints?.budget}
                onChange={(e) => setIntent(prev => ({
                  ...prev,
                  constraints: { ...prev.constraints!, budget: e.target.value as any }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">有限预算</option>
                <option value="medium">中等预算</option>
                <option value="high">充足预算</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                人力资源
              </label>
              <select
                value={intent.constraints?.resources}
                onChange={(e) => setIntent(prev => ({
                  ...prev,
                  constraints: { ...prev.constraints!, resources: e.target.value as any }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="limited">人力有限</option>
                <option value="adequate">人力充足</option>
                <option value="abundant">人力丰富</option>
              </select>
            </div>
          </div>

          {/* 反面提示词 */}
          <div>
            <label htmlFor="negativePrompts" className="block text-sm font-medium text-gray-700 mb-2">
              反面提示词（可选）
            </label>
            <textarea
              id="negativePrompts"
              rows={3}
              value={intent.negativePrompts || ''}
              onChange={(e) => setIntent(prev => ({ ...prev, negativePrompts: e.target.value }))}
              placeholder="请描述您不希望出现的内容或方向，例如：
- 不要过于商业化的推广语言
- 避免与竞品直接对比
- 不使用过于技术性的术语
- 避免争议性话题..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="text-xs text-gray-500 mt-1">
              <p>明确指出不希望在策略和内容中出现的元素，帮助AI更精准地生成符合您期望的方案</p>
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-gray-700 select-none">
                  💡 如何写好反面提示词？
                </summary>
                <div className="mt-2 space-y-1 text-gray-600">
                  <p>• 使用"不要"、"避免"等否定表述</p>
                  <p>• 具体描述不希望的风格或内容</p>
                  <p>• 考虑品牌调性和法规要求</p>
                  <p>• 每行一个限制条件，便于AI理解</p>
                </div>
              </details>
            </div>
          </div>

          {/* LLM模型选择 */}
          <div>
            <LLMSelector
              selectedConfigId={selectedLLMConfigId}
              onConfigSelect={setSelectedLLMConfigId}
              showDetails={true}
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isCreating || !intent.description?.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>AI正在制定策略...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>制定传播策略</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 策略结果显示 */}
      {currentStrategy && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">生成的传播策略</h3>
                <p className="text-gray-600 mt-1">{currentStrategy.name}</p>
              </div>
              <button
                onClick={() => setCurrentStrategy(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                重新制定
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 策略阶段 */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">执行阶段</h4>
              <div className="space-y-4">
                {currentStrategy.phases.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{phase.name}</h5>
                      <span className="text-sm text-gray-500">{phase.duration}周</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">目标：</span>
                        <ul className="text-sm text-gray-600 ml-4">
                          {phase.objectives.map((obj, i) => (
                            <li key={i} className="list-disc">{obj}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">平台：</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {phase.platforms.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 平台角色 */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">平台角色分工</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentStrategy.platformRoles).map(([platform, roleInfo]) => (
                  <div key={platform} className="border rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2 capitalize">{platform}</h5>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">角色：</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {typeof roleInfo === 'string' ? roleInfo : roleInfo.role}
                        </span>
                      </div>
                      {typeof roleInfo === 'object' && roleInfo.contentTypes && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">内容类型：</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {roleInfo.contentTypes.join(', ')}
                          </span>
                        </div>
                      )}
                      {typeof roleInfo === 'object' && roleInfo.frequency && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">发布频率：</span>
                          <span className="text-sm text-gray-600 ml-1">
                            每周{roleInfo.frequency}次
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 内容主题 */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">内容主题</h4>
              <div className="flex flex-wrap gap-2">
                {currentStrategy.contentThemes.map((theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* 预期成果 */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">预期成果</h4>
              <ul className="space-y-2">
                {currentStrategy.expectedOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
