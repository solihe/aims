import React, { useState, useEffect } from 'react';
import { Brain, Users, Target, AlertTriangle, CheckCircle, Clock, ArrowRight, MessageSquare, Zap } from 'lucide-react';

interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  deadline: string;
  dependencies?: string[];
  collaborators?: string[];
}

interface AgentCollaboration {
  id: string;
  initiator: string;
  participants: string[];
  topic: string;
  status: 'active' | 'completed';
  messages: number;
}

const CMODashboard = () => {
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 'task-1',
      agentId: 'intelligence',
      title: '监控AI创业话题热度变化',
      priority: 'high',
      status: 'in_progress',
      deadline: '2024-01-15 18:00',
      collaborators: ['twitter', 'linkedin']
    },
    {
      id: 'task-2',
      agentId: 'twitter',
      title: '基于GPT-5话题创作3条推文',
      priority: 'urgent',
      status: 'pending',
      deadline: '2024-01-15 16:00',
      dependencies: ['task-1']
    },
    {
      id: 'task-3',
      agentId: 'linkedin',
      title: '撰写AI工具对产品经理影响的深度分析',
      priority: 'medium',
      status: 'in_progress',
      deadline: '2024-01-16 10:00',
      dependencies: ['task-1']
    },
    {
      id: 'task-4',
      agentId: 'tiktok',
      title: '制作60秒AI趋势解读视频脚本',
      priority: 'high',
      status: 'blocked',
      deadline: '2024-01-15 20:00',
      dependencies: ['task-3'],
      collaborators: ['linkedin']
    }
  ]);

  const [collaborations, setCollaborations] = useState<AgentCollaboration[]>([
    {
      id: 'collab-1',
      initiator: 'intelligence',
      participants: ['twitter', 'linkedin', 'tiktok'],
      topic: 'GPT-5发布热点内容策略',
      status: 'active',
      messages: 12
    },
    {
      id: 'collab-2',
      initiator: 'linkedin',
      participants: ['tiktok'],
      topic: '长文内容转短视频脚本',
      status: 'active',
      messages: 5
    }
  ]);

  const agents = [
    { 
      id: 'intelligence', 
      name: '市场情报Agent', 
      status: 'active', 
      currentTask: '监控热点话题',
      performance: 92,
      tasksCompleted: 15,
      collaborations: 3
    },
    { 
      id: 'twitter', 
      name: 'X Agent', 
      status: 'active', 
      currentTask: '生成推文内容',
      performance: 85,
      tasksCompleted: 28,
      collaborations: 5
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn Agent', 
      status: 'active', 
      currentTask: '撰写深度文章',
      performance: 88,
      tasksCompleted: 12,
      collaborations: 4
    },
    { 
      id: 'tiktok', 
      name: 'TikTok Agent', 
      status: 'blocked', 
      currentTask: '等待素材输入',
      performance: 78,
      tasksCompleted: 8,
      collaborations: 2
    }
  ];

  const cmoDecisions = [
    {
      id: 1,
      decision: '调整内容策略：增加AI创业话题权重至40%',
      impact: '影响所有平台Agent的内容生成方向',
      timestamp: '10分钟前',
      status: 'executed'
    },
    {
      id: 2,
      decision: '启动跨平台联动：GPT-5话题内容矩阵',
      impact: '协调Intelligence、Twitter、LinkedIn、TikTok四个Agent',
      timestamp: '1小时前',
      status: 'in_progress'
    },
    {
      id: 3,
      decision: '暂停争议性话题内容生成',
      impact: '所有Agent避免敏感话题，专注正面价值输出',
      timestamp: '3小时前',
      status: 'completed'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'blocked': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CMO Agent 指挥中心</h1>
          <p className="text-gray-600">统一调度和协调所有子Agent，确保战略执行的一致性</p>
        </div>

        {/* CMO决策记录 */}
        <div className="mb-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              CMO 最新决策与指令
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {cmoDecisions.map((decision) => (
                <div key={decision.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{decision.decision}</h4>
                      <p className="text-sm text-gray-600 mb-2">{decision.impact}</p>
                      <span className="text-xs text-gray-500">{decision.timestamp}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      decision.status === 'executed' ? 'bg-green-100 text-green-800' :
                      decision.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {decision.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent状态监控 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  子Agent状态监控
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            agent.status === 'active' ? 'bg-green-500' : 
                            agent.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{agent.performance}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{agent.currentTask}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>完成任务: {agent.tasksCompleted}</span>
                        <span>协作中: {agent.collaborations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 任务分发与依赖 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  任务分发与依赖关系
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {agents.find(a => a.id === task.agentId)?.name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>截止: {task.deadline}</span>
                            {task.dependencies && (
                              <span className="flex items-center">
                                <ArrowRight className="h-3 w-3 mr-1" />
                                依赖: {task.dependencies.length}个任务
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.status === 'blocked' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {task.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-500" />}
                        </div>
                      </div>
                      
                      {task.collaborators && (
                        <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">协作Agent:</span>
                          {task.collaborators.map((collaborator, index) => (
                            <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {agents.find(a => a.id === collaborator)?.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Agent协作状态 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Agent间协作状态
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {collaborations.map((collab) => (
                    <div key={collab.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {collab.status}
                        </span>
                        <span className="text-xs text-gray-500">{collab.messages} 条消息</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-3">{collab.topic}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 w-16">发起者:</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {agents.find(a => a.id === collab.initiator)?.name}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-xs text-gray-500 w-16">参与者:</span>
                          <div className="flex flex-wrap gap-1">
                            {collab.participants.map((participant, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {agents.find(a => a.id === participant)?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className="mt-6 bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">快速操作</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  发布新的全局指令
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  启动紧急协作任务
                </button>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                  调整Agent优先级
                </button>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  查看详细协作日志
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMODashboard;