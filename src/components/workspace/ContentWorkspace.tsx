// AIMS 内容工作区组件
import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/useContentStore';
import { useStrategyStore } from '../../stores/useStrategyStore';
import {
  Edit3,
  Check,
  X,
  Clock,
  Calendar,
  Image,
  Video,
  FileText,
  Hash,
  Send,
  Eye,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';

interface ContentWorkspaceProps {
  onNavigateToAnalytics?: () => void;
}

export const ContentWorkspace: React.FC<ContentWorkspaceProps> = ({ onNavigateToAnalytics }) => {
  const { contentCalendar, currentStrategyId, updateCalendarItem } = useContentStore();
  const { currentStrategy } = useStrategyStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  if (!currentStrategy || !contentCalendar) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">需要先生成内容计划</h3>
          <p className="text-yellow-700">
            请先完成"策略制定"和"内容编排"步骤，然后返回此页面进行内容工作。
          </p>
        </div>
      </div>
    );
  }

  const platforms = [...new Set(contentCalendar.map(item => item.platform))];
  const statusOptions = [
    { value: 'all', label: '全部状态', color: 'gray' },
    { value: 'draft', label: '草稿', color: 'yellow' },
    { value: 'approved', label: '已审批', color: 'green' },
    { value: 'published', label: '已发布', color: 'blue' }
  ];

  const filteredContent = contentCalendar.filter(item => {
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    const platformMatch = selectedPlatform === 'all' || item.platform === selectedPlatform;
    return statusMatch && platformMatch;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setEditContent(item.content);
  };

  const handleSaveEdit = (itemId: string) => {
    updateCalendarItem(itemId, { content: editContent });
    setEditingItem(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditContent('');
  };

  const handleStatusChange = (itemId: string, newStatus: 'draft' | 'approved' | 'published') => {
    updateCalendarItem(itemId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <Edit3 className="w-4 h-4" />,
      approved: <Check className="w-4 h-4" />,
      published: <Send className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">内容工作区</h2>
        <p className="text-gray-600 mt-2">
          审核、编辑和优化生成的内容，准备发布到各个平台
        </p>
      </div>

      {/* 策略同步状态提示 */}
      {currentStrategy && currentStrategyId && currentStrategyId !== currentStrategy.id && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <p className="text-orange-800 font-medium">内容与策略不同步</p>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            当前内容是基于旧策略生成的，请返回"内容编排"页面重新生成最新内容
          </p>
        </div>
      )}

      {/* 工作区统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statusOptions.slice(1).map(status => {
          const count = contentCalendar.filter(item => item.status === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status.value)}`}>
                  {getStatusIcon(status.value)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 筛选控制 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容状态
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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

      {/* 内容列表 */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              {/* 内容头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {item.platform} • {item.contentType}
                    </h3>
                    <p className="text-sm text-gray-500">
                      第{item.week}周 • {item.publishTime} • {item.phase}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {statusOptions.find(s => s.value === item.status)?.label}
                  </span>
                </div>
              </div>

              {/* 标题 */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
              </div>

              {/* 内容编辑区域 */}
              <div className="mb-4">
                {editingItem === item.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="编辑内容..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>保存</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>取消</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
                  </div>
                )}
              </div>

              {/* 话题标签 */}
              {item.hashtags && item.hashtags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {item.hashtags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 素材需求 */}
              {item.mediaRequirements && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Image className="w-4 h-4" />
                    <span>素材需求：{item.mediaRequirements}</span>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{item.objective}</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  {editingItem !== item.id && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center space-x-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>编辑</span>
                    </button>
                  )}
                  
                  {item.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'approved')}
                      className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>审批</span>
                    </button>
                  )}
                  
                  {item.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'published')}
                      className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded flex items-center space-x-1"
                    >
                      <Send className="w-4 h-4" />
                      <span>发布</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>预览</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无内容</h3>
            <p className="text-gray-600">
              当前筛选条件下没有找到相关内容
            </p>
          </div>
        </div>
      )}

      {/* 下一步操作 - 效果分析 */}
      {contentCalendar && contentCalendar.some(item => item.status === 'published') && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">下一步：效果分析</h4>
                <p className="text-gray-600 text-sm">查看已发布内容的传播效果和数据分析</p>
              </div>
              {onNavigateToAnalytics && (
                <button
                  onClick={onNavigateToAnalytics}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>查看效果分析</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 预览模态框 */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  内容预览 - {previewItem.platform}
                </h3>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{previewItem.title}</h4>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">{previewItem.content}</p>
                </div>
                {previewItem.hashtags && previewItem.hashtags.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {previewItem.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-sm text-gray-500 space-y-1">
                  <p>发布时间：{previewItem.publishTime}</p>
                  <p>执行阶段：{previewItem.phase}</p>
                  <p>内容目标：{previewItem.objective}</p>
                  {previewItem.mediaRequirements && (
                    <p>素材需求：{previewItem.mediaRequirements}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    handleEdit(previewItem);
                    setPreviewItem(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  编辑内容
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
