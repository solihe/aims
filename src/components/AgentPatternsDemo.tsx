import React, { useState } from 'react';
import { Brain, GitBranch, Zap, RefreshCw, Target, Play, Settings } from 'lucide-react';

const AgentPatternsDemo = () => {
  const [selectedPattern, setSelectedPattern] = useState('react');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const agentPatterns = [
    {
      id: 'react',
      name: 'ReAct (Reason + Act)',
      description: 'CMO Agent的核心决策引擎，推理与行动交替',
      icon: Brain,
      color: 'bg-blue-100 text-blue-800',
      useCase: '处理复杂的用户指令，动态决策和调用子Agent',
      flow: ['用户指令', '思考分析', '选择行动', '执行观察', '决定下一步']
    },
    {
      id: 'plan-solve',
      name: 'Plan & Solve',
      description: '先整体规划，再逐步执行，动态调整',
      icon: Target,
      color: 'bg-green-100 text-green-800',
      useCase: '跨平台内容策略规划，长期内容矩阵设计',
      flow: ['分析需求', '制定计划', '拆解任务', '执行监控', '动态调整']
    },
    {
      id: 'parallel',
      name: 'LLM Compiler',
      description: '并行任务规划与执行，最后合并结果',
      icon: Zap,
      color: 'bg-purple-100 text-purple-800',
      useCase: '基于热点快速生成多平台内容矩阵',
      flow: ['任务分析', '并行生成', '质量检查', '结果合并', '策略优化']
    },
    {
      id: 'reflection',
      name: 'Basic Reflection',
      description: '生成初稿，反思批改，循环优化',
      icon: RefreshCw,
      color: 'bg-orange-100 text-orange-800',
      useCase: '内容质量优化，确保符合品牌价值观',
      flow: ['生成初稿', '质量评估', '反思改进', '重新生成', '达到标准']
    }
  ];

  const currentPattern = agentPatterns.find(p => p.id === selectedPattern);

  const handleExecutePattern = async () => {
    setIsExecuting(true);
    
    // 模拟执行不同的Agent模式
    setTimeout(() => {
      const mockResults = {
        react: {
          thoughts: ['分析用户需求：生成AI创业话题内容', '选择行动：协调多平台Agent', '观察结果：内容生成成功'],
          actions: ['analyze_request', 'coordinate_agents', 'monitor_execution'],
          finalResult: '成功生成跨平台AI创业内容矩阵',
          confidence: 0.92
        },
        'plan-solve': {
          plan: {
            coreMessage: 'AI创业的三个关键趋势',
            platforms: ['Twitter', 'LinkedIn', 'TikTok'],
            timeline: '2小时内完成'
          },
          tasks: [
            { platform: 'Twitter', type: '快速推文', status: 'completed' },
            { platform: 'LinkedIn', type: '深度分析', status: 'in_progress' },
            { platform: 'TikTok', type: '短视频脚本', status: 'pending' }
          ],
          adjustments: ['增加数据支撑', '优化发布时间']
        },
        parallel: {
          contentMatrix: [
            { platform: 'Twitter', content: '🚀 AI创业三大趋势...', engagement: '5.2%' },
            { platform: 'LinkedIn', content: '深度解析AI创业...', reach: '2.3K' },
            { platform: 'TikTok', content: '60秒看懂AI创业...', views: '12K' }
          ],
          executionTime: '45秒',
          crossPlatformSynergy: '高度一致的核心信息，平台特色鲜明'
        },
        reflection: {
          iterations: 3,
          qualityImprovement: '从6.5分提升到9.2分',
          optimizations: [
            '增加了具体数据支撑',
            '优化了标题吸引力',
            '加强了行动号召'
          ],
          finalQuality: 0.92
        }
      };

      setExecutionResult(mockResults[selectedPattern]);
      setIsExecuting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent设计模式演示</h1>
          <p className="text-gray-600">体验不同的Agent设计模式在内容生成中的应用</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 模式选择 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">选择Agent模式</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {agentPatterns.map((pattern) => {
                    const Icon = pattern.icon;
                    return (
                      <button
                        key={pattern.id}
                        onClick={() => {
                          setSelectedPattern(pattern.id);
                          setExecutionResult(null);
                        }}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedPattern === pattern.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <Icon className="h-5 w-5 mr-3 text-gray-600" />
                          <h4 className="font-medium text-gray-900">{pattern.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${pattern.color}`}>
                          {pattern.useCase}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 模式详情和执行 */}
          <div className="lg:col-span-2">
            {currentPattern && (
              <div className="space-y-6">
                {/* 模式详情 */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <currentPattern.icon className="h-6 w-6 mr-3 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{currentPattern.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{currentPattern.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">应用场景</h4>
                      <p className="text-sm text-gray-600">{currentPattern.useCase}</p>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">执行流程</h4>
                      <div className="flex items-center space-x-2 overflow-x-auto">
                        {currentPattern.flow.map((step, index) => (
                          <React.Fragment key={index}>
                            <div className="flex-shrink-0 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                              {step}
                            </div>
                            {index < currentPattern.flow.length - 1 && (
                              <div className="flex-shrink-0 text-gray-400">→</div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleExecutePattern}
                      disabled={isExecuting}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isExecuting ? '执行中...' : '执行演示'}
                    </button>
                  </div>
                </div>

                {/* 执行结果 */}
                {executionResult && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">执行结果</h3>
                    </div>
                    <div className="p-6">
                      {selectedPattern === 'react' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">思考过程</h4>
                            <div className="space-y-2">
                              {executionResult.thoughts.map((thought: string, index: number) => (
                                <div key={index} className="flex items-center text-sm">
                                  <Brain className="h-4 w-4 mr-2 text-blue-500" />
                                  <span className="text-gray-700">{thought}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">执行行动</h4>
                            <div className="flex flex-wrap gap-2">
                              {executionResult.actions.map((action: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-green-800 font-medium">最终结果: {executionResult.finalResult}</p>
                            <p className="text-green-600 text-sm mt-1">置信度: {(executionResult.confidence * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      )}

                      {selectedPattern === 'plan-solve' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">生成计划</h4>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">核心信息: {executionResult.plan.coreMessage}</p>
                              <p className="text-sm text-gray-700">目标平台: {executionResult.plan.platforms.join(', ')}</p>
                              <p className="text-sm text-gray-700">执行时间: {executionResult.plan.timeline}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">任务执行</h4>
                            <div className="space-y-2">
                              {executionResult.tasks.map((task: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <span className="font-medium text-gray-900">{task.platform}</span>
                                    <span className="text-sm text-gray-600 ml-2">{task.type}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {task.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPattern === 'parallel' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">并行生成结果</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {executionResult.contentMatrix.map((content: any, index: number) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <h5 className="font-medium text-gray-900 mb-2">{content.platform}</h5>
                                  <p className="text-sm text-gray-600 mb-2">{content.content}</p>
                                  <div className="text-xs text-gray-500">
                                    {content.engagement && `参与度: ${content.engagement}`}
                                    {content.reach && `覆盖: ${content.reach}`}
                                    {content.views && `观看: ${content.views}`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-purple-800 font-medium">执行时间: {executionResult.executionTime}</p>
                            <p className="text-purple-600 text-sm mt-1">{executionResult.crossPlatformSynergy}</p>
                          </div>
                        </div>
                      )}

                      {selectedPattern === 'reflection' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">优化过程</h4>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">迭代次数: {executionResult.iterations}</p>
                              <p className="text-sm text-gray-700">质量提升: {executionResult.qualityImprovement}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">优化内容</h4>
                            <div className="space-y-2">
                              {executionResult.optimizations.map((opt: string, index: number) => (
                                <div key={index} className="flex items-center text-sm">
                                  <RefreshCw className="h-4 w-4 mr-2 text-orange-500" />
                                  <span className="text-gray-700">{opt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <p className="text-orange-800 font-medium">最终质量评分: {(executionResult.finalQuality * 10).toFixed(1)}/10</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 模式对比 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">模式对比与应用建议</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agentPatterns.map((pattern) => {
                const Icon = pattern.icon;
                return (
                  <div key={pattern.id} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-lg ${pattern.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{pattern.name}</h4>
                    <p className="text-sm text-gray-600">{pattern.useCase}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPatternsDemo;