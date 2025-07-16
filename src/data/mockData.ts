// AIMS 模拟数据 - 用于开发阶段
import { CampaignStrategy, MarketingObjective, PlatformRole, ContentMatrix } from '../types';

// 模拟策略模板
export const mockStrategyTemplates = {
  [MarketingObjective.PRODUCT_LAUNCH]: {
    name: '产品发布四阶段传播',
    phases: [
      { name: '预热期', duration: 1, objectives: ['建立期待', '预告发布'], platforms: ['weibo', 'zhihu'] },
      { name: '发布期', duration: 1, objectives: ['正式发布', '媒体传播'], platforms: ['weibo', 'zhihu', 'xiaohongshu'] },
      { name: '深化期', duration: 2, objectives: ['深度解析', '用户教育'], platforms: ['zhihu', 'xiaohongshu'] },
      { name: '持续期', duration: 2, objectives: ['用户反馈', '持续优化'], platforms: ['weibo', 'xiaohongshu'] }
    ],
    platformRoles: {
      weibo: { role: PlatformRole.AWARENESS_DRIVER, contentTypes: ['动态', '话题'], frequency: 3 },
      zhihu: { role: PlatformRole.AUTHORITY_BUILDER, contentTypes: ['文章', '回答'], frequency: 2 },
      xiaohongshu: { role: PlatformRole.COMMUNITY_ENGAGER, contentTypes: ['笔记', '视频'], frequency: 2 }
    }
  },
  
  [MarketingObjective.BRAND_BUILDING]: {
    name: '品牌权威建设长期传播',
    phases: [
      { name: '基础建设', duration: 4, objectives: ['建立认知', '内容积累'], platforms: ['zhihu', 'weibo'] },
      { name: '影响扩大', duration: 4, objectives: ['扩大影响', '社区建设'], platforms: ['zhihu', 'xiaohongshu'] },
      { name: '权威确立', duration: 4, objectives: ['行业地位', '意见领袖'], platforms: ['zhihu', 'weibo', 'xiaohongshu'] }
    ],
    platformRoles: {
      weibo: { role: PlatformRole.TRAFFIC_GENERATOR, contentTypes: ['观点', '热点'], frequency: 4 },
      zhihu: { role: PlatformRole.AUTHORITY_BUILDER, contentTypes: ['专业文章', '深度回答'], frequency: 3 },
      xiaohongshu: { role: PlatformRole.COMMUNITY_ENGAGER, contentTypes: ['经验分享', '案例展示'], frequency: 2 }
    }
  }
};

// 模拟策略数据
export const mockStrategies: CampaignStrategy[] = [
  {
    id: 'strategy-1',
    name: 'AI产品发布传播策略',
    objective: MarketingObjective.PRODUCT_LAUNCH,
    phases: [
      { name: '预热期', duration: 1, objectives: ['建立期待', '预告发布'], platforms: ['weibo', 'zhihu'] },
      { name: '发布期', duration: 1, objectives: ['正式发布', '媒体传播'], platforms: ['weibo', 'zhihu', 'xiaohongshu'] },
      { name: '深化期', duration: 2, objectives: ['深度解析', '用户教育'], platforms: ['zhihu', 'xiaohongshu'] }
    ],
    platformRoles: {
      weibo: { role: PlatformRole.AWARENESS_DRIVER, contentTypes: ['产品动态', '发布话题'], frequency: 3 },
      zhihu: { role: PlatformRole.AUTHORITY_BUILDER, contentTypes: ['技术解析', '行业分析'], frequency: 2 },
      xiaohongshu: { role: PlatformRole.COMMUNITY_ENGAGER, contentTypes: ['使用体验', '场景展示'], frequency: 2 }
    },
    contentThemes: ['AI技术创新', '用户价值', '行业变革', '使用场景'],
    expectedOutcomes: ['提升品牌认知度', '获得早期用户', '建立行业影响力'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// 模拟内容矩阵数据
export const mockContentMatrices: ContentMatrix[] = [
  {
    id: 'matrix-1',
    strategyId: 'strategy-1',
    originalIntent: '为我们的新AI产品创建发布内容，强调技术创新和用户价值',
    platforms: [
      {
        platform: 'weibo',
        role: PlatformRole.AWARENESS_DRIVER,
        content: '🚀 重磅发布！我们的AI产品正式上线，革命性的技术突破，让工作效率提升300%！#AI创新 #效率工具 #科技前沿',
        hashtags: ['#AI创新', '#效率工具', '#科技前沿'],
        status: 'draft'
      },
      {
        platform: 'zhihu',
        role: PlatformRole.AUTHORITY_BUILDER,
        content: '# 深度解析：新一代AI产品的技术架构与创新突破\n\n在人工智能快速发展的今天，我们推出了一款革命性的AI产品...',
        title: '深度解析：新一代AI产品的技术架构与创新突破',
        status: 'draft'
      },
      {
        platform: 'xiaohongshu',
        role: PlatformRole.COMMUNITY_ENGAGER,
        content: '姐妹们！发现了一个超好用的AI工具✨ 工作效率直接起飞！分享几个实用场景给大家～',
        hashtags: ['#AI工具', '#效率提升', '#职场神器'],
        status: 'draft'
      }
    ],
    brandVoiceConsistency: 0.85,
    linkages: [
      {
        sourceId: 'weibo-content',
        targetId: 'zhihu-content',
        linkageType: 'reference',
        referenceMethod: 'link',
        expectedFlow: 0.15
      }
    ],
    generatedAt: new Date('2024-01-01')
  }
];

// 模拟API响应延迟
export const mockApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// 模拟API错误
export const mockApiError = (message: string, probability: number = 0.1) => {
  if (Math.random() < probability) {
    throw new Error(message);
  }
};
