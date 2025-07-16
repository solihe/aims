import React, { useState, useEffect } from 'react';
import { Play, Settings, BarChart3, Clock, DollarSign, Zap, GitBranch, CheckCircle, AlertTriangle } from 'lucide-react';
import { difyWorkflowService, WorkflowTemplate } from '../services/difyWorkflowService';

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  agentId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  cost: number;
  executionTime: number;
}

const WorkflowManager = () => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    // 加载工作流模板
    const templates = difyWorkflowService.getWorkflowTemplates();
    setWorkflows(templates);

    // 模拟执行历史
    const mockExecutions: WorkflowExecution[] = [
      {
        id: 'exec-1',
        workflowId: 'twitter-quick-post',
        workflowName: 'X平台快速推文生成',
        agentId: 'twitter-agent',
        status: 'completed',
        startTime: '2024-01-15 14:30:00',
        endTime: '2024-01-15 14:30:45',
        inputs: { topic: 'GPT-5发布', tone: 'excited' },
        outputs: { tweet_content: '🚀 GPT-5正式发布！这次的突破将如何改变我们的工作方式？作为产品经理，我看到了无限可能... #GPT5 #AI #ProductManager' },
        cost: 0.02,
        executionTime: 45
      },
      {
        id: 'exec-2',
        workflowId: 'linkedin-deep-analysis',
        workflowName: 'LinkedIn深度分析文章',
        agentId: 'linkedin-agent',
        status: 'running',
        startTime: '2024-01-15 14:25:00',
        inputs: { industry_topic: 'AI对产品经理的影响', analysis_depth: 'deep' },
        cost: 0.08,
        executionTime: 180
      },
      {
        id: 'exec-3',
        workflowId: 'hot-topic-analysis',
        workflowName: '热点话题分析与策略',
        agentId: 'intelligence-agent',
        status: 'failed',
        startTime: '2024-01-15 14:20:00',
        endTime: '2024-01-15 14:22:30',
        inputs: { hot_topic: '字节跳动AI创作工具', brand_values: ['创新', '专业', '价值'] },
        cost: 0.05,
        executionTime: 150
      }
    ];
    setExecutions(mockExecutions);
  }, []);

  const categories = [
    { id: 'all', name: '全部', count: workflows.length },
    { id: 'content-generation', name: '内容生成', count: workflows.filter(w => w.category === 'content-generation').length },
    { id: 'analysis', name: '分析', count: workflows.filter(w => w.category === 'analysis').length },
    { id: 'optimization', name: '优化', count: workflows.filter(w => w.category === 'optimization').length },
    { id: 'collaboration', name: '协作', count: workflows.filter(w => w.category === 'collaboration').length }
  ];

  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.category === selectedCategory);

  const handleExecuteWorkflow = async (workflow: WorkflowTemplate) => {
    setIsExecuting(true);
    setSelectedWorkflow(workflow);
    
    // 模拟工作流执行
    setTimeout(() => {
      const newExecution: WorkflowExecution = {
        id: `exec-${Date.now()}`,
        workflowId: workflow.id,
        workflowName: workflow.name,
        agentId: 'manual-execution',
        status: 'completed',
        startTime: new Date().toLocaleString(),
        endTime: new Date(Date.now() + workflow.estimatedTime * 1000).toLocaleString(),
        inputs: { manual_trigger: true },
        outputs: { result: '工作流执行成功' },
        cost: workflow.estimatedCost,
        executionTime: workflow.estimatedTime
      };
      
      setExecutions(prev => [newExecution, ...prev]);
      setIsExecuting(false);
      setSelectedWorkflow(null);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content-generation':
        return 'bg-blue-100 text-blue-800';
      case 'analysis':
        return 'bg-green-100 text-green-800';
      case 'optimization':
        return 'bg-purple-100 text-purple-800';
      case 'collaboration':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dify 工作流管理中心</h1>
          <p className="text-gray-600">管理和监控所有Agent的Dify工作流执行</p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">可用工作流</p>
                <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">今日执行</p>
                <p className="text-2xl font-bold text-gray-900">{executions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">今日成本</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${executions.reduce((sum, exec) => sum + exec.cost, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">成功率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((executions.filter(e => e.status === 'completed').length / executions.length) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 工作流模板库 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">工作流模板库</h3>
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredWorkflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{workflow.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${getCategoryColor(workflow.category)}`}>
                            {workflow.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {workflow.estimatedTime}s
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${workflow.estimatedCost}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleExecuteWorkflow(workflow)}
                          disabled={isExecuting}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {isExecuting && selectedWorkflow?.id === workflow.id ? '执行中...' : '执行'}
                        </button>
                        <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          <Settings className="h-4 w-4 mr-1" />
                          配置
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 执行历史 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  执行历史
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {executions.map((execution) => (
                    <div key={execution.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(execution.status)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {execution.workflowName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">${execution.cost}</span>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        Agent: {execution.agentId}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {execution.startTime}
                        {execution.endTime && ` - ${execution.endTime}`}
                      </div>
                      
                      {execution.status === 'completed' && execution.outputs && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                          <strong>输出:</strong> {JSON.stringify(execution.outputs).substring(0, 100)}...
                        </div>
                      )}
                      
                      {execution.status === 'failed' && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                          执行失败，请检查配置
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent工作流配置 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Agent 工作流配置</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">X Agent</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>快速推文生成</span>
                    <span className="text-green-600">已配置</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>内容质量检查</span>
                    <span className="text-green-600">已配置</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>跨平台适配</span>
                    <span className="text-gray-400">未配置</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">LinkedIn Agent</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>深度分析文章</span>
                    <span className="text-green-600">已配置</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>内容质量检查</span>
                    <span className="text-green-600">已配置</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>SEO优化</span>
                    <span className="text-gray-400">未配置</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">TikTok Agent</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>短视频脚本生成</span>
                    <span className="text-green-600">已配置</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>热门元素分析</span>
                    <span className="text-green-600">已配置</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>音乐推荐</span>
                    <span className="text-gray-400">未配置</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowManager;