import React, { useState } from 'react';
import { CheckCircle, X, Edit3, Clock, AlertTriangle, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

const ContentReview = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  
  const contentItems = [
    {
      id: 1,
      platform: 'X',
      title: '关于AI创业的3个核心洞察',
      content: '在AI创业的道路上，我发现了三个关键洞察：\n\n1. 技术壁垒不再是护城河，数据质量才是\n2. 产品体验比算法精度更重要\n3. 商业模式创新胜过技术创新\n\n你在AI创业中有哪些不同的发现？',
      generatedBy: 'X Agent',
      priority: 'high',
      scheduledTime: '2024-01-15 14:30',
      expectedMetrics: { engagement: '5.2%', reach: '2.3K' },
      tags: ['AI', '创业', '洞察'],
      status: 'pending'
    },
    {
      id: 2,
      platform: 'LinkedIn',
      title: '深度：产品经理如何拥抱AI时代',
      content: '随着AI技术的快速发展，产品经理的角色正在发生深刻变化。不再是简单的需求收集者，而是需要成为AI产品的架构师...\n\n[完整文章内容展示]',
      generatedBy: 'LinkedIn Agent',
      priority: 'medium',
      scheduledTime: '2024-01-15 09:00',
      expectedMetrics: { engagement: '8.1%', reach: '1.8K' },
      tags: ['产品经理', 'AI', '深度思考'],
      status: 'reviewing'
    },
    {
      id: 3,
      platform: 'TikTok',
      title: '60秒解读最新AI行业趋势',
      content: '【视频脚本】\n开场：最新AI行业有三个重要趋势...\n中段：详细解读每个趋势的影响...\n结尾：对创业者的建议...',
      generatedBy: 'TikTok Agent',
      priority: 'high',
      scheduledTime: '2024-01-15 19:00',
      expectedMetrics: { engagement: '12.5%', reach: '5.2K' },
      tags: ['AI趋势', '短视频', '行业分析'],
      status: 'approved'
    }
  ];

  const handleApprove = (id) => {
    console.log('Approved content:', id);
    // 这里会调用API更新内容状态
  };

  const handleReject = (id) => {
    console.log('Rejected content:', id);
    // 这里会调用API更新内容状态
  };

  const handleEdit = (id) => {
    setSelectedContent(contentItems.find(item => item.id === id));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600';
      case 'reviewing': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">内容审核中心</h1>
          <p className="text-gray-600">为AI生成的内容注入人性化的洞察和价值观</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content List */}
          <div className="space-y-6">
            {contentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.platform}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className={`flex items-center ${getStatusColor(item.status)}`}>
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">{item.status}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                  
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-gray-500">
                      Generated by {item.generatedBy} • {item.scheduledTime}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {item.expectedMetrics.engagement}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-3 w-3 mr-1" />
                        {item.expectedMetrics.reach}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      批准
                    </button>
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      拒绝
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Panel */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Edit3 className="h-5 w-5 mr-2" />
                内容编辑器
              </h3>
              <p className="text-sm text-gray-600 mt-1">为AI生成的内容注入人性化的洞察</p>
            </div>
            <div className="p-6">
              {selectedContent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                    <input
                      type="text"
                      value={selectedContent.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                    <textarea
                      value={selectedContent.content}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      保存修改
                    </button>
                    <button
                      onClick={() => setSelectedContent(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">选择一个内容项开始编辑</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentReview;