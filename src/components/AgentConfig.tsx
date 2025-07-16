import React, { useState } from 'react';
import { Brain, Target, Shield, Settings, Plus, Edit2, Trash2 } from 'lucide-react';

const AgentConfig = () => {
  const [activeTab, setActiveTab] = useState('cmo');
  
  const agentConfigs = {
    cmo: {
      name: 'CMO Agent',
      description: '系统总指挥，负责战略规划和价值观控制',
      settings: {
        brandValues: [
          '专业性：保持行业专家的权威性',
          '创新性：始终关注前沿技术和趋势',
          '价值导向：为用户和行业创造实际价值',
          '真实性：避免夸大和虚假宣传'
        ],
        moralRedlines: [
          '不得进行人身攻击或恶意中伤',
          '不得发布未经证实的谣言或假消息',
          '不得使用愤怒诱饵或极端言论',
          '不得涉及敏感政治或宗教话题'
        ],
        businessGoals: [
          '品牌知名度提升 20%',
          '社交媒体关注者增长 15%',
          '内容平均参与度达到 8%',
          '每月产生 100+ 高质量潜在客户'
        ]
      }
    },
    intelligence: {
      name: '市场情报 Agent',
      description: '实时监控市场动态和热点话题',
      settings: {
        monitoringSources: [
          'X (Twitter) - 实时热点追踪',
          'Reddit - 社区讨论分析',
          'LinkedIn - 行业专业动态',
          'TikTok - 年轻用户趋势',
          'Google Trends - 搜索趋势分析'
        ],
        keywords: [
          'AI', '人工智能', '机器学习', '创业',
          '产品经理', '技术创新', '数字化转型'
        ],
        alertThresholds: {
          trendingScore: 85,
          sentimentScore: 0.6,
          relevanceScore: 0.75
        }
      }
    },
    platforms: {
      name: '平台子 Agent',
      description: '各社交平台的专门内容生成器',
      settings: {
        weibo: {
          maxLength: 140,
          tone: '热点、互动、有态度',
          postFrequency: '每天 5-8 条',
          contentTypes: ['热点评论', '行业观点', '互动话题'],
          specialFeatures: ['话题标签', '超话运营', '粉丝互动']
        },
        xiaohongshu: {
          maxLength: 1000,
          tone: '生活化、实用、种草',
          postFrequency: '每天 2-3 条',
          contentTypes: ['干货分享', '工具测评', '经验总结'],
          specialFeatures: ['图文并茂', '标签优化', '种草文案']
        },
        douyin: {
          duration: '15-180秒',
          tone: '年轻、有趣、易懂',
          postFrequency: '每天 2-4 条',
          contentTypes: ['知识科普', '工具演示', '行业解读'],
          specialFeatures: ['短视频脚本', '字幕优化', '热门音乐']
        },
        zhihu: {
          maxLength: 5000,
          tone: '专业、深度、有见解',
          postFrequency: '每周 3-5 篇',
          contentTypes: ['专业回答', '深度文章', '经验分享'],
          specialFeatures: ['问题匹配', '专业性', '逻辑性']
        },
        bilibili: {
          duration: '5-30分钟',
          tone: '专业、有趣、教学',
          postFrequency: '每周 2-3 个',
          contentTypes: ['技术教程', '行业分析', '工具评测'],
          specialFeatures: ['视频脚本', '弹幕互动', '分P结构']
        },
        wechat: {
          maxLength: 8000,
          tone: '专业、权威、有深度',
          postFrequency: '每周 2-3 篇',
          contentTypes: ['深度分析', '行业报告', '观点文章'],
          specialFeatures: ['排版美化', '阅读体验', '转发优化']
        },
        kuaishou: {
          duration: '15-60秒',
          tone: '接地气、实用、直接',
          postFrequency: '每天 2-3 条',
          contentTypes: ['实用技巧', '工具演示', '经验分享'],
          specialFeatures: ['老铁文化', '直播互动', '实用性']
        },
        toutiao: {
          maxLength: 3000,
          tone: '新闻化、客观、有料',
          postFrequency: '每天 3-5 篇',
          contentTypes: ['行业资讯', '深度报道', '观点评论'],
          specialFeatures: ['标题优化', '推荐算法', '阅读量']
        },
        twitter: {
          maxLength: 280,
          tone: '简洁、有力、互动性强',
          postFrequency: '每天 3-5 条',
          hashtagLimit: 3
        },
        linkedin: {
          maxLength: 3000,
          tone: '专业、深度、有洞察力',
          postFrequency: '每天 1-2 条',
          contentTypes: ['文章', '行业分析', '经验分享']
        },
        tiktok: {
          duration: '15-60秒',
          tone: '活泼、创意、视觉冲击力',
          postFrequency: '每天 1-2 条',
          contentTypes: ['趋势解读', '技巧分享', '行业科普']
        }
      }
    }
  };

  const currentConfig = agentConfigs[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent 配置中心</h1>
          <p className="text-gray-600">配置各个智能体的行为规则和参数</p>
        </div>

        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">智能体列表</h3>
              <nav className="space-y-2">
                {Object.entries(agentConfigs).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === key 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Brain className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">{config.name}</p>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Settings className="h-5 w-5 mr-3" />
                    {currentConfig.name} 配置
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    保存配置
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{currentConfig.description}</p>
              </div>

              <div className="p-6">
                {activeTab === 'cmo' && (
                  <div className="space-y-8">
                    {/* Brand Values */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        品牌价值观
                      </h3>
                      <div className="space-y-3">
                        {currentConfig.settings.brandValues.map((value, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{value}</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                          <Plus className="h-4 w-4 mr-2" />
                          添加新的价值观
                        </button>
                      </div>
                    </div>

                    {/* Moral Redlines */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        道德红线
                      </h3>
                      <div className="space-y-3">
                        {currentConfig.settings.moralRedlines.map((redline, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <span className="text-red-700">{redline}</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-red-600 hover:text-red-800">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="flex items-center px-4 py-2 border-2 border-dashed border-red-300 rounded-lg text-red-500 hover:border-red-400 hover:text-red-600 transition-colors">
                          <Plus className="h-4 w-4 mr-2" />
                          添加新的红线规则
                        </button>
                      </div>
                    </div>

                    {/* Business Goals */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        商业目标
                      </h3>
                      <div className="space-y-3">
                        {currentConfig.settings.businessGoals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-green-700">{goal}</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-green-600 hover:text-green-800">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="flex items-center px-4 py-2 border-2 border-dashed border-green-300 rounded-lg text-green-500 hover:border-green-400 hover:text-green-600 transition-colors">
                          <Plus className="h-4 w-4 mr-2" />
                          添加新的商业目标
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'intelligence' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">监控源配置</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentConfig.settings.monitoringSources.map((source, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{source}</span>
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">关键词监控</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentConfig.settings.keywords.map((keyword, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">预警阈值</h3>
                      <div className="space-y-4">
                        {Object.entries(currentConfig.settings.alertThresholds).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <label className="text-gray-700 font-medium">{key}</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={value * 100}
                              className="w-32"
                            />
                            <span className="text-gray-600 w-12">{(value * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'platforms' && (
                  <div className="space-y-8">
                    {Object.entries(currentConfig.settings).map(([platform, config]) => (
                      <div key={platform} className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{platform} Agent</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(config).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <label className="text-gray-700 font-medium capitalize">{key}</label>
                              <input
                                type="text"
                                value={Array.isArray(value) ? value.join(', ') : value}
                                className="px-3 py-2 border rounded-lg w-48"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfig;