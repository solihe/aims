// AIMS 内容编排组件
import React, { useState, useEffect } from 'react';
import { useStrategyStore } from '../../stores/useStrategyStore';
import { useContentStore } from '../../stores/useContentStore';
import { Calendar, Clock, Target, Users, FileText, Image, Video, Hash, ArrowRight } from 'lucide-react';

interface ContentOrchestrationProps {
  onNavigateToWorkspace?: () => void;
}

export const ContentOrchestration: React.FC<ContentOrchestrationProps> = ({ onNavigateToWorkspace }) => {
  const { currentStrategy } = useStrategyStore();
  const { contentCalendar, currentStrategyId, generateContentCalendar, isGenerating, clearContentCalendar } = useContentStore();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    if (currentStrategy) {
      // 如果没有内容日历，或者策略ID发生变化，则重新生成
      if (!contentCalendar || currentStrategyId !== currentStrategy.id) {
        generateContentCalendar(currentStrategy);
      }
    } else {
      // 如果没有策略，清除内容日历
      if (contentCalendar) {
        clearContentCalendar();
      }
    }
  }, [currentStrategy, contentCalendar, currentStrategyId, generateContentCalendar, clearContentCalendar]);

  if (!currentStrategy) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">需要先制定策略</h3>
          <p className="text-yellow-700">
            请先在"策略制定"页面生成传播策略，然后返回此页面进行内容编排。
          </p>
        </div>
      </div>
    );
  }

  const platforms = Object.keys(currentStrategy.platformRoles);
  const totalWeeks = currentStrategy.phases.reduce((sum, phase) => sum + phase.duration, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">内容编排</h2>
        <p className="text-gray-600 mt-2">
          基于策略"{currentStrategy.name}"生成具体的内容计划和发布日历
        </p>
      </div>

      {/* 策略概览 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">策略概览</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">营销目标</p>
                <p className="font-medium">{currentStrategy.objective}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">执行周期</p>
                <p className="font-medium">{totalWeeks}周</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">传播平台</p>
                <p className="font-medium">{platforms.length}个平台</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 策略变化提示 */}
      {currentStrategy && currentStrategyId && currentStrategyId !== currentStrategy.id && !isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">策略已更新</p>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            检测到策略变化，内容计划将自动重新生成以匹配新的策略要求
          </p>
        </div>
      )}

      {/* 内容日历生成 */}
      {isGenerating ? (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStrategyId !== currentStrategy.id ? 'AI正在重新生成内容计划...' : 'AI正在生成内容计划...'}
            </h3>
            <p className="text-gray-600">
              正在基于您的{currentStrategyId !== currentStrategy.id ? '最新' : ''}策略生成{totalWeeks}周的详细内容日历和具体文案
            </p>
          </div>
        </div>
      ) : contentCalendar ? (
        <>
          {/* 筛选控制 */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="p-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择周次
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: totalWeeks }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        第{i + 1}周
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择平台
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">全部平台</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 内容日历 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                第{selectedWeek}周内容计划
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {contentCalendar
                  .filter(item => item.week === selectedWeek)
                  .filter(item => selectedPlatform === 'all' || item.platform === selectedPlatform)
                  .map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {item.platform}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {item.contentType} • {item.publishTime}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {item.phase}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">标题</h5>
                          <p className="text-gray-900">{item.title}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">内容</h5>
                          <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
                        </div>
                        
                        {item.hashtags && item.hashtags.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">话题标签</h5>
                            <div className="flex flex-wrap gap-2">
                              {item.hashtags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.mediaRequirements && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">素材需求</h5>
                            <p className="text-gray-600 text-sm">{item.mediaRequirements}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{item.objective}</span>
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                              编辑
                            </button>
                            <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded">
                              批准
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* 下一步操作 */}
          {contentCalendar && contentCalendar.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">下一步：内容工作区</h4>
                    <p className="text-gray-600 text-sm">进入工作区审核、编辑和优化生成的内容</p>
                  </div>
                  {onNavigateToWorkspace && (
                    <button
                      onClick={onNavigateToWorkspace}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <span>进入工作区</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">准备生成内容计划</h3>
            <p className="text-gray-600 mb-4">
              点击下方按钮，AI将基于您的策略生成详细的内容日历
            </p>
            <button
              onClick={() => generateContentCalendar(currentStrategy)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              生成内容计划
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
