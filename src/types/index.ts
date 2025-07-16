// AIMS 战略性内容编排系统 - 核心类型定义

// ==================== 营销策略相关类型 ====================

export enum MarketingObjective {
  PRODUCT_LAUNCH = 'product_launch',
  BRAND_BUILDING = 'brand_building', 
  LEAD_GENERATION = 'lead_generation',
  SALES_CONVERSION = 'sales_conversion',
  CRISIS_MANAGEMENT = 'crisis_management'
}

export interface MarketingIntent {
  objective: MarketingObjective;
  description: string;
  targetAudience: {
    demographics: string[];
    psychographics: string[];
    platforms: string[];
  };
  keyMessages: string[];
  timeline: {
    urgency: 'immediate' | 'normal' | 'long_term';
    duration: number; // 周数
  };
  constraints: {
    budget: 'low' | 'medium' | 'high';
    resources: 'limited' | 'adequate' | 'abundant';
  };
  negativePrompts?: string; // 反面提示词
}

export interface CampaignStrategy {
  id: string;
  name: string;
  objective: MarketingObjective;
  phases: {
    name: string;
    duration: number;
    objectives: string[];
    platforms: string[];
  }[];
  platformRoles: {
    [platform: string]: {
      role: PlatformRole;
      contentTypes: string[];
      frequency: number;
    };
  };
  contentThemes: string[];
  expectedOutcomes: string[];
  negativePrompts?: string; // 反面提示词
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 平台角色相关类型 ====================

export enum PlatformRole {
  AWARENESS_DRIVER = 'awareness_driver',
  AUTHORITY_BUILDER = 'authority_builder', 
  CONVERSION_CLOSER = 'conversion_closer',
  COMMUNITY_ENGAGER = 'community_engager',
  TRAFFIC_GENERATOR = 'traffic_generator',
  SUPPORT_CHANNEL = 'support_channel'
}

export interface PlatformProfile {
  platform: string;
  characteristics: {
    contentFormat: string[];
    audienceType: string[];
    interactionStyle: string;
    contentLength: 'short' | 'medium' | 'long';
  };
  strengths: string[];
  limitations: string[];
}

export interface PlatformRoleAssignment {
  platform: string;
  primaryRole: PlatformRole;
  secondaryRoles: PlatformRole[];
  contentTypes: string[];
  publishFrequency: number;
  kpis: string[];
  resourceAllocation: number;
}

// ==================== 内容相关类型 ====================

export interface ContentRequest {
  intent: string;
  brandVoiceId: string;
  platforms: string[];
  strategy?: CampaignStrategy;
  phase?: string;
}

export interface ContentMatrix {
  id: string;
  strategyId: string;
  originalIntent: string;
  platforms: PlatformContent[];
  brandVoiceConsistency: number;
  linkages: ContentLinkage[];
  generatedAt: Date;
}

export interface PlatformContent {
  platform: string;
  role: PlatformRole;
  content: string;
  title?: string;
  hashtags?: string[];
  mentions?: string[];
  links?: ContentLink[];
  publishTime?: Date;
  status: 'draft' | 'approved' | 'published';
}

export interface ContentLinkage {
  sourceId: string;
  targetId: string;
  linkageType: 'reference' | 'continuation' | 'elaboration' | 'contrast';
  referenceMethod: 'link' | 'mention' | 'quote' | 'implicit';
  expectedFlow: number;
}

export interface ContentLink {
  url: string;
  text: string;
  type: 'internal' | 'external';
  platform?: string;
}

// ==================== 品牌声音相关类型 ====================

export interface BrandVoice {
  id: string;
  name: string;
  analysis: BrandVoiceAnalysis;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandVoiceAnalysis {
  languageStyle: {
    tone: 'formal' | 'casual' | 'professional' | 'friendly';
    voice: 'authoritative' | 'conversational' | 'inspirational';
    personality: string[];
  };
  vocabulary: {
    preferredWords: string[];
    avoidedWords: string[];
    industryTerms: string[];
    brandTerms: string[];
  };
  structure: {
    sentenceLength: 'short' | 'medium' | 'long' | 'mixed';
    paragraphStyle: 'concise' | 'detailed' | 'storytelling';
    openingStyle: string[];
    closingStyle: string[];
  };
  content: {
    topics: string[];
    angles: string[];
    examples: string[];
    metaphors: string[];
  };
}

// ==================== 用户相关类型 ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  brandVoices: string[];
  strategies: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

// ==================== API响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ==================== 状态管理类型 ====================

export interface AppState {
  currentView: 'strategy' | 'orchestration' | 'content' | 'analytics' | 'llm-settings';
  isLoading: boolean;
  error: string | null;
  user: User | null;
}

export interface StrategyState {
  currentStrategy: CampaignStrategy | null;
  strategies: CampaignStrategy[];
  isCreating: boolean;
}

export interface ContentState {
  currentMatrix: ContentMatrix | null;
  matrices: ContentMatrix[];
  isGenerating: boolean;
}

export interface BrandState {
  currentBrandVoice: BrandVoice | null;
  brandVoices: BrandVoice[];
  isLearning: boolean;
}
