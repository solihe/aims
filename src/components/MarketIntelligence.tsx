import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, Clock, ExternalLink, Filter, RefreshCw, AlertTriangle, Target, Zap, Lightbulb, Hash } from 'lucide-react';
import { newsNowService } from '../services/newsNowService';
import { hotspotAnalysisService, HotKeyword, MemeInfo, HotspotOpportunity } from '../services/hotspotAnalysisService';

interface HotTopic {
  id: string;
  title: string;
  url: string;
  hot: number;
  timestamp: string;
  source: string;
  category?: string;
  relevanceScore?: number;
  sentimentScore?: number;
  keywords?: string[];
}

interface NewsSource {
  id: string;
  name: string;
  enabled: boolean;
  lastUpdate: string;
  topicsCount: number;
}

const MarketIntelligence = () => {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([]);
  const [memes, setMemes] = useState<MemeInfo[]>([]);
  const [opportunities, setOpportunities] = useState<HotspotOpportunity[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([
    { id: 'weibo', name: '微博热搜', enabled: true, lastUpdate: '2分钟前', topicsCount: 50 },
    { id: 'zhihu', name: '知乎热榜', enabled: true, lastUpdate: '5分钟前', topicsCount: 30 },
    { id: 'baidu', name: '百度热点', enabled: true, lastUpdate: '3分钟前', topicsCount: 20 },
    { id: 'toutiao', name: '头条热榜', enabled: false, lastUpdate: '10分钟前', topicsCount: 25 },
    { id: 'douyin', name: '抖音热点', enabled: true, lastUpdate: '1分钟前', topicsCount: 40 },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'keywords' | 'memes' | 'opportunities'

  // 模拟热点数据
  useEffect(() => {
    const initializeData = async () => {
      const mockTopics: HotTopic[] = [
        {
          id: '1',
          title: 'OpenAI发布GPT-5预览版，性能提升显著',
          url: 'https://example.com/gpt5',
          hot: 892456,
          timestamp: '10分钟前',
          source: 'weibo',
          category: 'tech',
          relevanceScore: 0.95,
          sentimentScore: 0.8,
          keywords: ['AI', 'GPT-5', 'OpenAI', '人工智能']
        },
        {
          id: '2',
          title: '字节跳动推出AI创作工具，挑战传统内容生产',
          url: 'https://example.com/bytedance-ai',
          hot: 654321,
          timestamp: '25分钟前',
          source: 'zhihu',
          category: 'business',
          relevanceScore: 0.88,
          sentimentScore: 0.6,
          keywords: ['字节跳动', 'AI创作', '内容生产']
        },
        {
          id: '3',
          title: '产品经理如何在AI时代保持竞争力',
          url: 'https://example.com/pm-ai',
          hot: 234567,
          timestamp: '1小时前',
          source: 'baidu',
          category: 'career',
          relevanceScore: 0.92,
          sentimentScore: 0.7,
          keywords: ['产品经理', 'AI时代', '竞争力']
        },
        {
          id: '4',
          title: '创业公司如何利用AI降低运营成本',
          url: 'https://example.com/startup-ai',
          hot: 156789,
          timestamp: '2小时前',
          source: 'douyin',
          category: 'startup',
          relevanceScore: 0.85,
          sentimentScore: 0.75,
          keywords: ['创业', 'AI', '运营成本']
        },
        {
          id: '5',
          title: '技术创新推动传统行业数字化转型',
          url: 'https://example.com/digital-transform',
          hot: 98765,
          timestamp: '3小时前',
          source: 'toutiao',
          category: 'industry',
          relevanceScore: 0.78,
          sentimentScore: 0.65,
          keywords: ['技术创新', '数字化转型', '传统行业']
        }
      ];
      setHotTopics(mockTopics);
      
      // 自动分析热点
      await analyzeHotspots(mockTopics);
    };

    initializeData();
  }, []);

  // 智能分析热点
  const analyzeHotspots = async (topics: HotTopic[]) => {
    try {
      // 1. 提取热门关键词
      const keywords = await hotspotAnalysisService.extractHotKeywords(topics);
      setHotKeywords(keywords);
      
      // 2. 识别meme信息
      const memeInfo = await hotspotAnalysisService.identifyMemes(topics);
      setMemes(memeInfo);
      
      // 3. 生成蹭热点机会
      const opps = await hotspotAnalysisService.generateHotspotOpportunities(keywords, memeInfo, topics);
      setOpportunities(opps);
    } catch (error) {
      console.error('Failed to analyze hotspots:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // 调用真实的数据获取服务
      const freshTopics = await newsNowService.getAllHotTopics();
      
      // 转换为组件需要的格式
      const formattedTopics: HotTopic[] = freshTopics.map((topic, index) => ({
        id: `fresh-${index}`,
        title: topic.title,
        url: topic.url,
        hot: topic.hot || 0,
        timestamp: topic.timestamp || new Date().toISOString(),
        source: topic.source,
        category: 'tech', // 可以根据标题智能分类
        relevanceScore: newsNowService.calculateRelevanceScore(topic, monitoringKeywords),
        sentimentScore: newsNowService.analyzeSentiment(topic.title),
        keywords: monitoringKeywords.filter(keyword => 
          topic.title.toLowerCase().includes(keyword.toLowerCase())
        )
      }));
      
      if (formattedTopics.length > 0) {
        setHotTopics(formattedTopics);
        await analyzeHotspots(formattedTopics);
      }
    } catch (error) {
      console.error('Failed to refresh topics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-800';
    if (score >= 0.8) return 'bg-blue-100 text-blue-800';
    if (score >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTopics = selectedCategory === 'all' 
    ? hotTopics 
    : hotTopics.filter(topic => topic.category === selectedCategory);

  const getKeywordTrendIcon = (trend: string) => {
    switch(trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">市场情报中心</h1>
              <p className="text-gray-600">基于 NewsNow 的实时热点话题监控与分析</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '更新中...' : '刷新数据'}
            </button>
          </div>
        </div>
        
        {/* 智能分析标签页 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'topics', name: '热点话题', icon: TrendingUp, count: hotTopics.length },
                { id: 'keywords', name: '智能关键词', icon: Hash, count: hotKeywords.length },
                { id: 'memes', name: 'Meme分析', icon: Zap, count: memes.length },
                { id: 'opportunities', name: '蹭热点机会', icon: Lightbulb, count: opportunities.length }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 数据源状态 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  数据源状态
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          source.enabled ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{source.name}</p>
                          <p className="text-xs text-gray-500">{source.lastUpdate}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">{source.topicsCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 智能关键词TOP5 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">智能识别关键词</h3>
                <p className="text-sm text-gray-600">自动提取的热门关键词</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {hotKeywords.slice(0, 5).map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getKeywordTrendIcon(keyword.trend)}</span>
                        <div>
                          <span className="font-medium text-gray-900">{keyword.keyword}</span>
                          <div className="text-xs text-gray-500">
                            {keyword.category} • 频次: {keyword.frequency}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {(keyword.opportunityScore * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">机会评分</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {activeTab === 'topics' && '实时热点话题'}
                    {activeTab === 'keywords' && '智能关键词分析'}
                    {activeTab === 'memes' && 'Meme信息分析'}
                    {activeTab === 'opportunities' && '蹭热点机会'}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">全部分类</option>
                      <option value="tech">科技</option>
                      <option value="business">商业</option>
                      <option value="startup">创业</option>
                      <option value="career">职场</option>
                      <option value="industry">行业</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {/* 热点话题列表 */}
                {activeTab === 'topics' && (
                  <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <div key={topic.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {topic.source}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${getRelevanceColor(topic.relevanceScore || 0)}`}>
                              相关度: {((topic.relevanceScore || 0) * 100).toFixed(0)}%
                            </span>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-1 ${getSentimentColor(topic.sentimentScore || 0)}`} />
                              <span className="text-xs text-gray-500">
                                情感: {((topic.sentimentScore || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              热度: {topic.hot.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {topic.timestamp}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {topic.keywords?.map((keyword, index) => (
                              <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            生成内容
                          </button>
                        </div>
                      </div>
                      
                      {/* 内容建议 */}
                      {topic.relevanceScore && topic.relevanceScore > 0.8 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-900 mb-1">内容机会建议</p>
                              <p className="text-blue-700">
                                这个话题与您的品牌高度相关，建议立即创作相关内容。
                                可以从产品经理视角分析AI工具对工作流程的影响。
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                )}

                {/* 智能关键词分析 */}
                {activeTab === 'keywords' && (
                  <div className="space-y-4">
                    {hotKeywords.map((keyword, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-semibold text-gray-900">{keyword.keyword}</h4>
                              <span className="text-lg">{getKeywordTrendIcon(keyword.trend)}</span>
                              <span className={`text-xs px-2 py-1 rounded font-medium ${getRelevanceColor(keyword.relevanceToGoals)}`}>
                                相关度: {(keyword.relevanceToGoals * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">出现频次:</span>
                                <span className="ml-1 font-medium">{keyword.frequency}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Meme价值:</span>
                                <span className="ml-1 font-medium">{(keyword.memeValue * 100).toFixed(0)}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">传播潜力:</span>
                                <span className="ml-1 font-medium">{(keyword.viralPotential * 100).toFixed(0)}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">情感倾向:</span>
                                <span className={`ml-1 font-medium ${getSentimentColor(keyword.sentiment)}`}>
                                  {(keyword.sentiment * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {(keyword.opportunityScore * 100).toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500">机会评分</div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">相关话题: </span>
                          <span className="text-sm text-gray-800">{keyword.relatedTopics.slice(0, 2).join(', ')}</span>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          生成蹭热点内容
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Meme信息分析 */}
                {activeTab === 'memes' && (
                  <div className="space-y-4">
                    {memes.map((meme, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">{meme.name}</h4>
                            <p className="text-gray-600 mb-3">{meme.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">热度:</span>
                                <span className="ml-1 font-medium">{meme.popularity.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">生命周期:</span>
                                <span className="ml-1 font-medium">{meme.lifespan}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">主要平台:</span>
                                <span className="ml-1 font-medium">{meme.platforms.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">适应策略:</h5>
                          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{meme.adaptationStrategy}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {meme.targetAudience.map((audience, idx) => (
                            <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 蹭热点机会 */}
                {activeTab === 'opportunities' && (
                  <div className="space-y-6">
                    {opportunities.map((opp, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-semibold text-gray-900">{opp.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded border font-medium ${getUrgencyColor(opp.urgency)}`}>
                                {opp.urgency}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <span>相关度: {(opp.relevanceScore * 100).toFixed(0)}%</span>
                              <span>预估触达: {opp.estimatedReach.toLocaleString()}</span>
                              <span>关键词: {opp.keywords.slice(0, 3).join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 内容建议 */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">内容建议:</h5>
                          <div className="space-y-3">
                            {opp.contentSuggestions.map((suggestion, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">{suggestion.platform}</span>
                                  <span className="text-sm text-gray-600">{suggestion.timing}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{suggestion.content}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {suggestion.hashtags.map((tag, tagIdx) => (
                                      <span key={tagIdx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-xs text-green-600">
                                    预期参与度: {(suggestion.expectedEngagement * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            立即执行
                          </button>
                          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                            加入计划
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">智能关键词</p>
                <p className="text-2xl font-bold text-gray-900">{hotKeywords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meme识别</p>
                <p className="text-2xl font-bold text-gray-900">{memes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">蹭热点机会</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">高价值机会</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.filter(o => o.relevanceScore > 0.7).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;