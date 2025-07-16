import React from 'react';
import { Brain, Users, TrendingUp, Settings, Eye, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const agents = [
    { id: 'cmo', name: 'CMO Agent', status: 'active', tasks: 12, performance: 85 },
    { id: 'intelligence', name: '市场情报Agent', status: 'active', tasks: 8, performance: 92 },
    { id: 'weibo', name: '微博Agent', status: 'active', tasks: 28, performance: 88 },
    { id: 'xiaohongshu', name: '小红书Agent', status: 'active', tasks: 22, performance: 85 },
    { id: 'douyin', name: '抖音Agent', status: 'active', tasks: 35, performance: 82 },
    { id: 'zhihu', name: '知乎Agent', status: 'active', tasks: 18, performance: 90 },
    { id: 'bilibili', name: 'B站Agent', status: 'active', tasks: 15, performance: 87 },
    { id: 'wechat', name: '微信公众号Agent', status: 'active', tasks: 12, performance: 89 },
    { id: 'kuaishou', name: '快手Agent', status: 'active', tasks: 20, performance: 83 },
    { id: 'toutiao', name: '今日头条Agent', status: 'active', tasks: 16, performance: 86 },
    { id: 'twitter', name: 'X Agent', status: 'active', tasks: 25, performance: 78 },
    { id: 'linkedin', name: 'LinkedIn Agent', status: 'active', tasks: 15, performance: 88 },
    { id: 'tiktok', name: 'TikTok Agent', status: 'active', tasks: 20, performance: 82 },
  ];

  const contentQueue = [
    { id: 1, platform: '微博', title: '关于AI创业的3个核心洞察', status: 'pending', priority: 'high' },
    { id: 2, platform: '知乎', title: '深度：产品经理如何拥抱AI时代', status: 'reviewing', priority: 'medium' },
    { id: 3, platform: '抖音', title: '60秒解读最新AI行业趋势', status: 'approved', priority: 'high' },
    { id: 4, platform: '小红书', title: 'AI工具测评：产品经理必备神器', status: 'pending', priority: 'urgent' },
    { id: 5, platform: 'B站', title: '【技术分享】AI时代的产品思维', status: 'reviewing', priority: 'medium' },
    { id: 6, platform: '微信公众号', title: '深度解析：AI创业的商业逻辑', status: 'approved', priority: 'high' },
  ];

  const metrics = [
    { label: '今日生成内容', value: '68', change: '+25%' },
    { label: '待审核内容', value: '15', change: '+8%' },
    { label: '平均参与度', value: '7.2%', change: '+18%' },
    { label: '品牌提及量', value: '3.8K', change: '+45%' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                AIMS 控制台
              </h1>
              <p className="text-gray-600">AI内容影响力矩阵系统 - 统一管理您的数字内容生态</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">系统运行正常</span>
              </div>
              <button className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                <span className="text-xs text-gray-500 ml-2">vs 昨日</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Status */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Agent 状态监控
                </h3>
                <p className="text-sm text-gray-600 mt-1">实时监控所有Agent的运行状态和性能指标</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all duration-200">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          agent.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-600">{agent.tasks} 个活跃任务</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${agent.performance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{agent.performance}%</span>
                          </div>
                          <p className="text-xs text-gray-500">性能指标</p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Queue */}
          <div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  内容审核队列
                </h3>
                <p className="text-sm text-gray-600 mt-1">待审核和已处理的内容列表</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {contentQueue.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                          {item.platform}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          item.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500 mr-1" />}
                          {item.status === 'reviewing' && <Eye className="h-4 w-4 text-blue-500 mr-1" />}
                          {item.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                          <span className="text-xs text-gray-600">{item.status}</span>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          查看详情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Overview */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              策略执行概览
            </h3>
            <p className="text-sm text-gray-600 mt-1">整体策略执行效果和关键指标</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">78%</div>
                <p className="text-sm text-gray-600">内容策略执行率</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                <p className="text-sm text-gray-600">品牌价值观合规率</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">156%</div>
                <p className="text-sm text-gray-600">平均参与度增长</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;