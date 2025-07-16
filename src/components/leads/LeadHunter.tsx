// AIMS 线索猎手组件 (占位符)
import React from 'react';
import { Search, Target, Users, MessageCircle, TrendingUp, Settings, AlertCircle } from 'lucide-react';

export const LeadHunter: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">线索猎手</h2>
        <p className="text-gray-600 mt-2">
          智能发现和管理潜在客户 - 类似 ReplyHunter 的功能
        </p>
      </div>

      {/* 开发中提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">功能开发中</h3>
            <p className="text-blue-700 mt-1">
              线索猎手模块正在开发中，将提供类似 ReplyHunter 的智能线索发现功能
            </p>
          </div>
        </div>
      </div>

      {/* 功能预览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">关键词监控</h3>
          </div>
          <p className="text-gray-600">
            监控社交媒体平台上的相关关键词提及，实时发现潜在客户讨论
          </p>
          <div className="mt-4 text-sm text-gray-500">
            • 多平台监控 (微博、知乎、小红书等)
            • 实时关键词追踪
            • 智能过滤和排序
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">潜客识别</h3>
          </div>
          <p className="text-gray-600">
            分析用户行为和内容，智能识别高质量潜在客户
          </p>
          <div className="mt-4 text-sm text-gray-500">
            • 用户画像分析
            • 需求意图识别
            • 线索质量评分
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">智能回复</h3>
          </div>
          <p className="text-gray-600">
            AI生成个性化回复内容，自然地参与相关讨论
          </p>
          <div className="mt-4 text-sm text-gray-500">
            • 上下文理解
            • 个性化回复生成
            • 自动化互动策略
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">线索管理</h3>
          </div>
          <p className="text-gray-600">
            CRM式的线索管理系统，跟踪和管理发现的潜在客户
          </p>
          <div className="mt-4 text-sm text-gray-500">
            • 线索信息收集
            • 跟进状态管理
            • 转化漏斗分析
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">效果分析</h3>
          </div>
          <p className="text-gray-600">
            分析线索获取效果，优化监控和互动策略
          </p>
          <div className="mt-4 text-sm text-gray-500">
            • 发现效率统计
            • 转化率分析
            • ROI评估
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">自动化配置</h3>
          </div>
          <p className="text-gray-600">
            配置自动化规则，提高线索发现和跟进效率
          </p>
          <div className="mt-4 text-sm text-gray-500">
            • 监控规则设置
            • 自动回复配置
            • 跟进提醒设置
          </div>
        </div>
      </div>

      {/* 开发计划 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">开发计划</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">第一阶段：基础架构</h4>
                <p className="text-gray-600 text-sm">
                  设计线索猎手的核心架构，包括数据模型、API接口和基础UI组件
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">第二阶段：平台集成</h4>
                <p className="text-gray-600 text-sm">
                  集成主要社交媒体平台API，实现关键词监控和内容抓取功能
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">第三阶段：AI分析</h4>
                <p className="text-gray-600 text-sm">
                  开发用户意图分析、线索质量评分和智能回复生成功能
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">第四阶段：自动化</h4>
                <p className="text-gray-600 text-sm">
                  实现自动化监控、回复和跟进功能，提供完整的线索管理解决方案
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
