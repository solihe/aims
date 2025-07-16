import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Clock, TrendingUp, Users, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'cmo' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    actionType?: 'report' | 'suggestion' | 'alert' | 'confirmation';
    data?: any;
  };
}

interface SystemStatus {
  activeAgents: number;
  pendingTasks: number;
  todayContent: number;
  avgEngagement: string;
}

const CMOChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'cmo',
      content: '您好！我是您的CMO Agent。我刚刚完成了今日的工作总结，目前系统运行良好。是否需要我汇报具体情况？',
      timestamp: '09:00',
      metadata: { actionType: 'report' }
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    activeAgents: 4,
    pendingTasks: 8,
    todayContent: 12,
    avgEngagement: '7.2%'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟CMO Agent的主动汇报
  useEffect(() => {
    const intervals = [
      // 定期工作汇报
      setTimeout(() => {
        addCMOMessage(
          '📊 工作汇报：今日已生成12条内容，其中8条已通过审核。LinkedIn Agent完成了一篇关于AI创业的深度文章，预计阅读量可达2K+。需要您审核吗？',
          'report'
        );
      }, 5000),
      
      // 热点机会提醒
      setTimeout(() => {
        addCMOMessage(
          '🔥 机会提醒：市场情报Agent发现"GPT-5"话题热度激增至89万，建议立即启动相关内容创作。我已准备好3个平台的内容策略，是否执行？',
          'suggestion'
        );
      }, 15000),
      
      // 异常情况警报
      setTimeout(() => {
        addCMOMessage(
          '⚠️ 注意：TikTok Agent遇到内容审核阻塞，有2个视频脚本需要人工干预。同时检测到竞品在相同话题上的活跃度增加，建议加快发布节奏。',
          'alert'
        );
      }, 25000)
    ];

    return () => intervals.forEach(clearTimeout);
  }, []);

  const addCMOMessage = (content: string, actionType: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'cmo',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      metadata: { actionType }
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟CMO Agent的智能回复
    setTimeout(() => {
      let response = '';
      const input = inputMessage.toLowerCase();
      
      if (input.includes('汇报') || input.includes('状态') || input.includes('情况')) {
        response = `📈 当前系统状态汇报：
        
• 活跃Agent：${systemStatus.activeAgents}个（市场情报、X、LinkedIn、TikTok）
• 待处理任务：${systemStatus.pendingTasks}个
• 今日生成内容：${systemStatus.todayContent}条
• 平均参与度：${systemStatus.avgEngagement}

重点进展：
1. LinkedIn Agent完成AI创业深度文章，预计影响力评分8.5/10
2. 市场情报Agent识别出3个高价值热点话题
3. X Agent的推文系列获得了156%的参与度增长

需要我详细展开任何一项吗？`;
      } else if (input.includes('热点') || input.includes('话题')) {
        response = `🔍 当前热点话题分析：

高优先级机会：
1. "GPT-5发布" - 热度89万，相关度95%，建议立即行动
2. "AI创业融资" - 热度23万，相关度88%，适合深度分析
3. "产品经理AI工具" - 热度15万，相关度92%，符合目标受众

我建议：
• 立即让X Agent发布GPT-5快速解读推文
• LinkedIn Agent撰写AI创业融资深度分析
• TikTok Agent制作产品经理AI工具使用技巧视频

是否授权执行这个计划？`;
      } else if (input.includes('执行') || input.includes('开始') || input.includes('授权')) {
        response = `✅ 收到执行指令！正在协调各Agent：

任务分发中：
• X Agent：生成3条GPT-5相关推文（预计15分钟完成）
• LinkedIn Agent：撰写AI创业融资分析文章（预计2小时完成）
• TikTok Agent：制作产品经理工具视频脚本（预计45分钟完成）

我会实时监控执行进度，有任何异常会立即向您汇报。预计首批内容将在30分钟内提交审核。`;
      } else if (input.includes('停止') || input.includes('暂停')) {
        response = `⏸️ 已暂停所有Agent的内容生成任务。

当前状态：
• 已完成的内容将保留在审核队列
• 进行中的任务已安全停止
• 所有Agent进入待命状态

请告诉我暂停的原因，我会相应调整后续策略。需要我做什么特殊处理吗？`;
      } else if (input.includes('优化') || input.includes('改进')) {
        response = `🎯 基于最近数据分析，我发现以下优化机会：

内容策略优化：
• LinkedIn长文的平均阅读完成率达到78%，建议增加此类内容比重
• X平台的互动类推文效果比纯信息类推文好35%
• TikTok视频在19:00-21:00发布效果最佳

Agent协作优化：
• 建议建立LinkedIn→TikTok的内容转化流水线
• 市场情报Agent的预警阈值可以调整到85%以提高精准度

是否需要我实施这些优化建议？`;
      } else {
        response = `我理解您的指令："${inputMessage}"

让我为您分析和执行：
• 正在解析您的需求...
• 评估可行性和资源需求...
• 制定执行计划...

请稍等，我会在30秒内给您详细的执行方案。如果有任何不明确的地方，我会主动询问。`;
      }

      const cmoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'cmo',
        content: response,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        metadata: { actionType: 'confirmation' }
      };
      
      setMessages(prev => [...prev, cmoResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (actionType?: string) => {
    switch (actionType) {
      case 'report': return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'suggestion': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'confirmation': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            CMO Agent 对话中心
          </h1>
          <p className="text-gray-600">与您的AI首席营销官实时对话，获取工作汇报和执行指令</p>
        </div>

        {/* 系统状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">活跃Agent</p>
                <p className="text-xl font-bold text-gray-900">{systemStatus.activeAgents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">待处理任务</p>
                <p className="text-xl font-bold text-gray-900">{systemStatus.pendingTasks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">今日内容</p>
                <p className="text-xl font-bold text-gray-900">{systemStatus.todayContent}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">平均参与度</p>
                <p className="text-xl font-bold text-gray-900">{systemStatus.avgEngagement}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 对话界面 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              CMO Agent 实时对话
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">在线</span>
            </h3>
          </div>
          
          {/* 消息列表 */}
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.type === 'cmo'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-yellow-100 text-yellow-900'
                  }`}>
                    {message.type === 'cmo' && (
                      <div className="flex items-center mb-2">
                        {getMessageIcon(message.metadata?.actionType)}
                        <span className="ml-2 text-xs font-medium text-gray-600">CMO Agent</span>
                        <span className="ml-auto text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.type === 'user' && (
                      <div className="text-xs text-blue-200 mt-1 text-right">{message.timestamp}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-xs">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">CMO Agent 正在思考...</span>
                      <div className="ml-2 flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入指令或询问CMO Agent..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* 快捷指令 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                '汇报今日工作状态',
                '分析当前热点话题',
                '执行内容生成计划',
                '优化Agent协作效率',
                '暂停所有任务'
              ].map((command, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(command)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 使用提示</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• CMO Agent会主动汇报工作进展和重要事件</li>
            <li>• 您可以用自然语言下达任何指令，如"分析热点话题"、"暂停所有任务"</li>
            <li>• CMO Agent会智能理解您的意图并协调各子Agent执行</li>
            <li>• 所有重要决策都会向您确认，确保符合您的价值观和目标</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CMOChat;