import React, { useState } from 'react';
import { MessageSquare, Users, Clock, ArrowRight, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface CollaborationMessage {
  id: string;
  agentId: string;
  agentName: string;
  message: string;
  timestamp: string;
  type: 'info' | 'request' | 'response' | 'alert';
}

interface CollaborationSession {
  id: string;
  topic: string;
  initiator: string;
  participants: string[];
  status: 'active' | 'completed' | 'paused';
  startTime: string;
  messages: CollaborationMessage[];
  outcome?: string;
}

const AgentCollaboration = () => {
  const [selectedSession, setSelectedSession] = useState<string>('session-1');
  
  const collaborationSessions: CollaborationSession[] = [
    {
      id: 'session-1',
      topic: 'GPT-5发布热点内容策略协作',
      initiator: 'intelligence',
      participants: ['twitter', 'linkedin', 'tiktok'],
      status: 'active',
      startTime: '2024-01-15 14:30',
      messages: [
        {
          id: 'msg-1',
          agentId: 'intelligence',
          agentName: '市场情报Agent',
          message: '检测到GPT-5相关话题热度激增，当前热度指数: 892,456。建议立即启动内容创作。',
          timestamp: '14:30',
          type: 'info'
        },
        {
          id: 'msg-2',
          agentId: 'cmo',
          agentName: 'CMO Agent',
          message: '收到。请各平台Agent根据以下策略执行：1) 突出技术突破价值 2) 关联产品经理工作影响 3) 避免过度炒作',
          timestamp: '14:32',
          type: 'request'
        },
        {
          id: 'msg-3',
          agentId: 'twitter',
          agentName: 'X Agent',
          message: '已生成3条推文草稿，主题分别为：技术突破解读、对开发者影响、未来趋势预测。预计发布时间间隔2小时。',
          timestamp: '14:35',
          type: 'response'
        },
        {
          id: 'msg-4',
          agentId: 'linkedin',
          agentName: 'LinkedIn Agent',
          message: '正在撰写深度分析文章《GPT-5时代：产品经理的机遇与挑战》，需要TikTok Agent提供短视频要点配合推广。',
          timestamp: '14:38',
          type: 'request'
        },
        {
          id: 'msg-5',
          agentId: 'tiktok',
          agentName: 'TikTok Agent',
          message: '收到LinkedIn Agent请求。将基于长文内容制作3个短视频脚本：1分钟技术解读、30秒要点总结、60秒实用建议。',
          timestamp: '14:42',
          type: 'response'
        },
        {
          id: 'msg-6',
          agentId: 'intelligence',
          agentName: '市场情报Agent',
          message: '⚠️ 注意：竞品公司已开始相关话题营销，建议加快内容发布节奏，抢占话语权。',
          timestamp: '14:45',
          type: 'alert'
        }
      ]
    },
    {
      id: 'session-2',
      topic: '长文内容转短视频脚本协作',
      initiator: 'linkedin',
      participants: ['tiktok'],
      status: 'completed',
      startTime: '2024-01-15 10:00',
      outcome: '成功将LinkedIn深度文章转化为3个TikTok短视频脚本',
      messages: [
        {
          id: 'msg-7',
          agentId: 'linkedin',
          agentName: 'LinkedIn Agent',
          message: '已完成《AI创业者必知的5个关键趋势》文章，需要转化为短视频内容。文章要点已整理。',
          timestamp: '10:00',
          type: 'request'
        },
        {
          id: 'msg-8',
          agentId: 'tiktok',
          agentName: 'TikTok Agent',
          message: '收到文章要点。将制作3个系列短视频：趋势1-2（60秒）、趋势3-4（45秒）、趋势5+总结（60秒）。',
          timestamp: '10:05',
          type: 'response'
        },
        {
          id: 'msg-9',
          agentId: 'tiktok',
          agentName: 'TikTok Agent',
          message: '✅ 3个短视频脚本已完成，已提交审核队列。预计总播放时长165秒，覆盖所有核心要点。',
          timestamp: '10:30',
          type: 'info'
        }
      ]
    }
  ];

  const agents = [
    { id: 'cmo', name: 'CMO Agent', color: 'bg-purple-100 text-purple-800' },
    { id: 'intelligence', name: '市场情报Agent', color: 'bg-blue-100 text-blue-800' },
    { id: 'weibo', name: '微博Agent', color: 'bg-red-100 text-red-800' },
    { id: 'xiaohongshu', name: '小红书Agent', color: 'bg-pink-100 text-pink-800' },
    { id: 'douyin', name: '抖音Agent', color: 'bg-black text-white' },
    { id: 'zhihu', name: '知乎Agent', color: 'bg-blue-100 text-blue-800' },
    { id: 'bilibili', name: 'B站Agent', color: 'bg-cyan-100 text-cyan-800' },
    { id: 'wechat', name: '微信公众号Agent', color: 'bg-green-100 text-green-800' },
    { id: 'kuaishou', name: '快手Agent', color: 'bg-orange-100 text-orange-800' },
    { id: 'toutiao', name: '今日头条Agent', color: 'bg-red-100 text-red-800' },
    { id: 'twitter', name: 'X Agent', color: 'bg-sky-100 text-sky-800' },
    { id: 'linkedin', name: 'LinkedIn Agent', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'tiktok', name: 'TikTok Agent', color: 'bg-pink-100 text-pink-800' }
  ];

  const getMessageTypeIcon = (type: string) => {
    switch(type) {
      case 'request': return <ArrowRight className="h-4 w-4 text-orange-500" />;
      case 'response': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAgentColor = (agentId: string) => {
    return agents.find(a => a.id === agentId)?.color || 'bg-gray-100 text-gray-800';
  };

  const currentSession = collaborationSessions.find(s => s.id === selectedSession);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent协作中心</h1>
          <p className="text-gray-600">实时监控和管理Agent间的协作对话</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 协作会话列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  协作会话
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {collaborationSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedSession === session.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          session.status === 'active' ? 'bg-green-100 text-green-800' :
                          session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                        <span className="text-xs text-gray-500">{session.messages.length}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-2">{session.topic}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.startTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 协作对话详情 */}
          <div className="lg:col-span-3">
            {currentSession && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{currentSession.topic}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentSession.status === 'active' ? 'bg-green-100 text-green-800' :
                      currentSession.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentSession.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span>发起者: {agents.find(a => a.id === currentSession.initiator)?.name}</span>
                    <span>参与者: {currentSession.participants.length + 1}个Agent</span>
                    <span>开始时间: {currentSession.startTime}</span>
                  </div>
                </div>

                {/* 参与者列表 */}
                <div className="px-6 py-3 bg-gray-50 border-b">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">参与Agent:</span>
                    <span className={`text-xs px-2 py-1 rounded ${getAgentColor(currentSession.initiator)}`}>
                      {agents.find(a => a.id === currentSession.initiator)?.name} (发起者)
                    </span>
                    {currentSession.participants.map((participantId) => (
                      <span key={participantId} className={`text-xs px-2 py-1 rounded ${getAgentColor(participantId)}`}>
                        {agents.find(a => a.id === participantId)?.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 对话消息 */}
                <div className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {currentSession.messages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getMessageTypeIcon(message.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${getAgentColor(message.agentId)}`}>
                              {message.agentName}
                            </span>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 协作结果 */}
                  {currentSession.outcome && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">协作结果</span>
                      </div>
                      <p className="text-sm text-green-700">{currentSession.outcome}</p>
                    </div>
                  )}

                  {/* 如果是活跃会话，显示输入框 */}
                  {currentSession.status === 'active' && (
                    <div className="mt-6 border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder="CMO Agent 发送指令..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCollaboration;