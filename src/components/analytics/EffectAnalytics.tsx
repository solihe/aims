// AIMS 效果分析组件
import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/useContentStore';
import { useStrategyStore } from '../../stores/useStrategyStore';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  Eye,
  Target,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// 模拟分析数据类型
interface PlatformAnalytics {
  platform: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagement: number;
  reach: number;
  conversion: number;
}

interface CampaignAnalytics {
  totalContent: number;
  publishedContent: number;
  totalReach: number;
  totalEngagement: number;
  averageEngagement: number;
  topPerformingPlatform: string;
  campaignROI: number;
  objectiveCompletion: number;
}

export const EffectAnalytics: React.FC = () => {
  const { contentCalendar } = useContentStore();
  const { currentStrategy } = useStrategyStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [analyticsData, setAnalyticsData] = useState<{
    campaign: CampaignAnalytics;
    platforms: PlatformAnalytics[];
  } | null>(null);

  useEffect(() => {
    if (currentStrategy && contentCalendar) {
      // 模拟生成分析数据
      generateMockAnalytics();
    }
  }, [currentStrategy, contentCalendar, selectedTimeRange]);

  const generateMockAnalytics = () => {
    if (!contentCalendar || !currentStrategy) return;

    const platforms = [...new Set(contentCalendar.map(item => item.platform))];
    const publishedContent = contentCalendar.filter(item => item.status === 'published');
    
    const platformAnalytics: PlatformAnalytics[] = platforms.map(platform => {
      const platformContent = publishedContent.filter(item => item.platform === platform);
      const baseViews = Math.floor(Math.random() * 50000) + 10000;
      
      return {
        platform,
        totalPosts: platformContent.length,
        totalViews: baseViews,
        totalLikes: Math.floor(baseViews * (0.02 + Math.random() * 0.03)),
        totalComments: Math.floor(baseViews * (0.005 + Math.random() * 0.01)),
        totalShares: Math.floor(baseViews * (0.001 + Math.random() * 0.005)),
        engagement: Math.round((2 + Math.random() * 3) * 100) / 100,
        reach: Math.floor(baseViews * (0.7 + Math.random() * 0.3)),
        conversion: Math.round((0.5 + Math.random() * 1.5) * 100) / 100
      };
    });

    const totalReach = platformAnalytics.reduce((sum, p) => sum + p.reach, 0);
    const totalEngagement = platformAnalytics.reduce((sum, p) => sum + p.totalLikes + p.totalComments + p.totalShares, 0);
    const topPlatform = platformAnalytics.reduce((max, p) => p.engagement > max.engagement ? p : max);

    const campaignAnalytics: CampaignAnalytics = {
      totalContent: contentCalendar.length,
      publishedContent: publishedContent.length,
      totalReach,
      totalEngagement,
      averageEngagement: Math.round((totalEngagement / publishedContent.length) * 100) / 100,
      topPerformingPlatform: topPlatform.platform,
      campaignROI: Math.round((150 + Math.random() * 100) * 100) / 100,
      objectiveCompletion: Math.round((70 + Math.random() * 25) * 100) / 100
    };

    setAnalyticsData({
      campaign: campaignAnalytics,
      platforms: platformAnalytics
    });
  };

  if (!currentStrategy || !contentCalendar) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">需要完成前置步骤</h3>
          <p className="text-yellow-700">
            请先完成"策略制定"、"内容编排"和"内容工作区"步骤，然后返回此页面查看效果分析。
          </p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">正在分析数据...</h3>
            <p className="text-gray-600">
              正在收集和分析各平台的传播效果数据
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { campaign, platforms } = analyticsData;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">效果分析</h2>
        <p className="text-gray-600 mt-2">
          分析"{currentStrategy.name}"的传播效果和数据表现
        </p>
      </div>

      {/* 时间范围选择 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">时间范围:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
              <option value="all">全部时间</option>
            </select>
          </div>
        </div>
      </div>

      {/* 核心指标概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总触达人数</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalReach.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总互动量</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalEngagement.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.3%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">平均互动率</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.averageEngagement}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.1%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">目标完成度</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.objectiveCompletion}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                良好
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 平台表现对比 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">平台表现对比</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">平台</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">发布数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">浏览量</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">点赞数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">评论数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">分享数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">互动率</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((platform, index) => (
                  <tr key={platform.platform} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium capitalize">{platform.platform}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{platform.totalPosts}</td>
                    <td className="py-3 px-4">{platform.totalViews.toLocaleString()}</td>
                    <td className="py-3 px-4">{platform.totalLikes.toLocaleString()}</td>
                    <td className="py-3 px-4">{platform.totalComments.toLocaleString()}</td>
                    <td className="py-3 px-4">{platform.totalShares.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        platform.engagement > 3 
                          ? 'bg-green-100 text-green-800' 
                          : platform.engagement > 2 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {platform.engagement}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 策略执行总结 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">执行总结</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">内容完成率</span>
              <span className="font-medium">
                {campaign.publishedContent}/{campaign.totalContent} 
                ({Math.round((campaign.publishedContent / campaign.totalContent) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">最佳表现平台</span>
              <span className="font-medium capitalize">{campaign.topPerformingPlatform}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">投资回报率</span>
              <span className="font-medium text-green-600">{campaign.campaignROI}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">目标达成度</span>
              <span className="font-medium">{campaign.objectiveCompletion}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">优化建议</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">内容质量优秀</p>
                <p className="text-sm text-gray-600">平均互动率超过行业标准</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">发布频率可优化</p>
                <p className="text-sm text-gray-600">建议增加高峰时段发布频次</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">扩大传播范围</p>
                <p className="text-sm text-gray-600">可考虑增加新的传播平台</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
