// Dify工作流服务集成
export interface DifyWorkflowRequest {
  workflowId: string;
  inputs: Record<string, any>;
  user: string;
  conversationId?: string;
}

export interface DifyWorkflowResponse {
  workflowRunId: string;
  taskId: string;
  data: {
    id: string;
    workflow_id: string;
    status: 'running' | 'succeeded' | 'failed' | 'stopped';
    outputs: Record<string, any>;
    error?: string;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'content-generation' | 'analysis' | 'optimization' | 'collaboration';
  inputs: WorkflowInput[];
  outputs: WorkflowOutput[];
  estimatedCost: number;
  estimatedTime: number;
}

export interface WorkflowInput {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface WorkflowOutput {
  name: string;
  type: string;
  description: string;
}

class DifyWorkflowService {
  private baseUrl: string;
  private apiKey: string;
  private workflowTemplates: Map<string, WorkflowTemplate> = new Map();

  constructor(baseUrl = 'https://api.dify.ai/v1', apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.initializeWorkflowTemplates();
  }

  // 初始化预定义的工作流模板
  private initializeWorkflowTemplates() {
    const templates: WorkflowTemplate[] = [
      {
        id: 'twitter-quick-post',
        name: 'X平台快速推文生成',
        description: '基于热点话题快速生成吸引人的推文',
        category: 'content-generation',
        inputs: [
          { name: 'topic', type: 'text', required: true, description: '话题内容' },
          { name: 'tone', type: 'text', required: false, description: '语调风格', defaultValue: 'professional' },
          { name: 'hashtags', type: 'array', required: false, description: '相关标签' },
          { name: 'target_audience', type: 'text', required: false, description: '目标受众' }
        ],
        outputs: [
          { name: 'tweet_content', type: 'text', description: '生成的推文内容' },
          { name: 'engagement_score', type: 'number', description: '预期参与度评分' },
          { name: 'suggested_time', type: 'text', description: '建议发布时间' }
        ],
        estimatedCost: 0.02,
        estimatedTime: 30
      },
      {
        id: 'linkedin-deep-analysis',
        name: 'LinkedIn深度分析文章',
        description: '生成专业的行业分析文章',
        category: 'content-generation',
        inputs: [
          { name: 'industry_topic', type: 'text', required: true, description: '行业话题' },
          { name: 'analysis_depth', type: 'text', required: false, description: '分析深度', defaultValue: 'medium' },
          { name: 'data_sources', type: 'array', required: false, description: '数据来源' },
          { name: 'target_length', type: 'number', required: false, description: '目标字数', defaultValue: 1500 }
        ],
        outputs: [
          { name: 'article_content', type: 'text', description: '文章正文' },
          { name: 'key_insights', type: 'array', description: '核心洞察点' },
          { name: 'call_to_action', type: 'text', description: '行动号召' },
          { name: 'seo_keywords', type: 'array', description: 'SEO关键词' }
        ],
        estimatedCost: 0.15,
        estimatedTime: 180
      },
      {
        id: 'tiktok-script-generation',
        name: 'TikTok短视频脚本生成',
        description: '创作吸引年轻用户的短视频脚本',
        category: 'content-generation',
        inputs: [
          { name: 'core_message', type: 'text', required: true, description: '核心信息' },
          { name: 'video_duration', type: 'number', required: false, description: '视频时长(秒)', defaultValue: 60 },
          { name: 'style', type: 'text', required: false, description: '视频风格', defaultValue: 'educational' },
          { name: 'trending_elements', type: 'array', required: false, description: '热门元素' }
        ],
        outputs: [
          { name: 'script_content', type: 'text', description: '视频脚本' },
          { name: 'visual_cues', type: 'array', description: '视觉提示' },
          { name: 'music_suggestions', type: 'array', description: '音乐建议' },
          { name: 'hashtag_strategy', type: 'array', description: '标签策略' }
        ],
        estimatedCost: 0.08,
        estimatedTime: 90
      },
      {
        id: 'content-cross-platform',
        name: '跨平台内容适配',
        description: '将一个平台的内容适配到其他平台',
        category: 'optimization',
        inputs: [
          { name: 'source_content', type: 'text', required: true, description: '源内容' },
          { name: 'source_platform', type: 'text', required: true, description: '源平台' },
          { name: 'target_platforms', type: 'array', required: true, description: '目标平台列表' },
          { name: 'maintain_core_message', type: 'boolean', required: false, description: '保持核心信息', defaultValue: true }
        ],
        outputs: [
          { name: 'adapted_contents', type: 'object', description: '适配后的内容' },
          { name: 'platform_specific_tips', type: 'object', description: '平台特定建议' },
          { name: 'engagement_predictions', type: 'object', description: '参与度预测' }
        ],
        estimatedCost: 0.12,
        estimatedTime: 120
      },
      {
        id: 'hot-topic-analysis',
        name: '热点话题分析与策略',
        description: '分析热点话题并生成内容策略',
        category: 'analysis',
        inputs: [
          { name: 'hot_topic', type: 'text', required: true, description: '热点话题' },
          { name: 'brand_values', type: 'array', required: true, description: '品牌价值观' },
          { name: 'target_audience', type: 'text', required: false, description: '目标受众' },
          { name: 'competitor_analysis', type: 'boolean', required: false, description: '是否包含竞品分析', defaultValue: true }
        ],
        outputs: [
          { name: 'topic_analysis', type: 'text', description: '话题分析报告' },
          { name: 'content_opportunities', type: 'array', description: '内容机会' },
          { name: 'risk_assessment', type: 'text', description: '风险评估' },
          { name: 'recommended_actions', type: 'array', description: '推荐行动' }
        ],
        estimatedCost: 0.25,
        estimatedTime: 300
      },
      {
        id: 'content-quality-check',
        name: '内容质量检查与优化',
        description: '检查内容质量并提供优化建议',
        category: 'optimization',
        inputs: [
          { name: 'content', type: 'text', required: true, description: '待检查内容' },
          { name: 'platform', type: 'text', required: true, description: '发布平台' },
          { name: 'brand_guidelines', type: 'text', required: false, description: '品牌指南' },
          { name: 'check_sentiment', type: 'boolean', required: false, description: '检查情感倾向', defaultValue: true }
        ],
        outputs: [
          { name: 'quality_score', type: 'number', description: '质量评分' },
          { name: 'improvement_suggestions', type: 'array', description: '改进建议' },
          { name: 'compliance_check', type: 'object', description: '合规性检查' },
          { name: 'optimized_content', type: 'text', description: '优化后内容' }
        ],
        estimatedCost: 0.06,
        estimatedTime: 45
      }
    ];

    templates.forEach(template => {
      this.workflowTemplates.set(template.id, template);
    });
  }

  // 执行工作流
  async runWorkflow(request: DifyWorkflowRequest): Promise<DifyWorkflowResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: request.inputs,
          response_mode: 'blocking',
          user: request.user,
          conversation_id: request.conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`Dify API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error running Dify workflow:', error);
      throw error;
    }
  }

  // 获取工作流执行状态
  async getWorkflowStatus(workflowRunId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/run/${workflowRunId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get workflow status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting workflow status:', error);
      throw error;
    }
  }

  // 获取可用的工作流模板
  getWorkflowTemplates(category?: string): WorkflowTemplate[] {
    const templates = Array.from(this.workflowTemplates.values());
    return category ? templates.filter(t => t.category === category) : templates;
  }

  // 获取特定工作流模板
  getWorkflowTemplate(id: string): WorkflowTemplate | undefined {
    return this.workflowTemplates.get(id);
  }

  // 批量执行工作流
  async runBatchWorkflows(requests: DifyWorkflowRequest[]): Promise<DifyWorkflowResponse[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.runWorkflow(request))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Batch workflow ${index} failed:`, result.reason);
        throw result.reason;
      }
    });
  }

  // 智能工作流推荐
  recommendWorkflow(context: {
    contentType: string;
    platform: string;
    urgency: 'low' | 'medium' | 'high';
    budget: number;
  }): WorkflowTemplate[] {
    const templates = this.getWorkflowTemplates();
    
    return templates
      .filter(template => {
        // 基于上下文过滤合适的工作流
        if (context.budget < template.estimatedCost) return false;
        if (context.urgency === 'high' && template.estimatedTime > 60) return false;
        return true;
      })
      .sort((a, b) => {
        // 基于成本和时间排序
        const scoreA = this.calculateWorkflowScore(a, context);
        const scoreB = this.calculateWorkflowScore(b, context);
        return scoreB - scoreA;
      })
      .slice(0, 3); // 返回前3个推荐
  }

  private calculateWorkflowScore(template: WorkflowTemplate, context: any): number {
    let score = 0;
    
    // 成本效益评分
    score += (1 - template.estimatedCost / context.budget) * 40;
    
    // 时间效率评分
    const timeScore = context.urgency === 'high' ? 
      (1 - template.estimatedTime / 300) * 40 : 
      (1 - template.estimatedTime / 600) * 20;
    score += timeScore;
    
    // 功能匹配评分
    if (template.name.toLowerCase().includes(context.platform.toLowerCase())) {
      score += 20;
    }
    
    return score;
  }

  // 工作流性能统计
  async getWorkflowStats(workflowId: string, timeRange: string = '7d'): Promise<any> {
    // 这里可以集成Dify的统计API或自建统计系统
    return {
      totalRuns: 0,
      successRate: 0,
      averageExecutionTime: 0,
      totalCost: 0,
      popularInputs: [],
      errorPatterns: []
    };
  }
}

// Agent工作流集成器
export class AgentWorkflowIntegrator {
  private difyService: DifyWorkflowService;
  private workflowCache: Map<string, any> = new Map();

  constructor(difyService: DifyWorkflowService) {
    this.difyService = difyService;
  }

  // 为特定Agent配置工作流
  async configureAgentWorkflows(agentId: string, workflows: string[]) {
    const agentWorkflows = workflows.map(workflowId => {
      const template = this.difyService.getWorkflowTemplate(workflowId);
      if (!template) {
        throw new Error(`Workflow template ${workflowId} not found`);
      }
      return template;
    });

    this.workflowCache.set(agentId, agentWorkflows);
    return agentWorkflows;
  }

  // Agent执行工作流
  async executeAgentWorkflow(
    agentId: string, 
    workflowId: string, 
    inputs: Record<string, any>
  ): Promise<any> {
    const request: DifyWorkflowRequest = {
      workflowId,
      inputs: {
        ...inputs,
        agent_id: agentId,
        timestamp: new Date().toISOString()
      },
      user: `agent_${agentId}`
    };

    const result = await this.difyService.runWorkflow(request);
    
    // 记录执行历史
    this.recordWorkflowExecution(agentId, workflowId, inputs, result);
    
    return result;
  }

  // 智能工作流选择
  async selectOptimalWorkflow(
    agentId: string,
    task: {
      type: string;
      priority: 'low' | 'medium' | 'high';
      deadline: Date;
      budget: number;
    }
  ): Promise<WorkflowTemplate> {
    const availableWorkflows = this.workflowCache.get(agentId) || [];
    const context = {
      contentType: task.type,
      platform: agentId.includes('twitter') ? 'twitter' : 
                agentId.includes('linkedin') ? 'linkedin' : 
                agentId.includes('tiktok') ? 'tiktok' : 'general',
      urgency: task.priority,
      budget: task.budget
    };

    const recommendations = this.difyService.recommendWorkflow(context);
    
    // 选择最适合的工作流
    return recommendations.find(workflow => 
      availableWorkflows.some(aw => aw.id === workflow.id)
    ) || recommendations[0];
  }

  private recordWorkflowExecution(
    agentId: string, 
    workflowId: string, 
    inputs: any, 
    result: any
  ) {
    // 记录执行历史，用于后续优化
    const execution = {
      agentId,
      workflowId,
      inputs,
      result,
      timestamp: new Date(),
      success: result.data.status === 'succeeded',
      executionTime: result.data.elapsed_time,
      cost: this.calculateExecutionCost(result)
    };

    // 存储到数据库或缓存
    console.log('Workflow execution recorded:', execution);
  }

  private calculateExecutionCost(result: any): number {
    // 基于token使用量计算成本
    const tokenCost = result.data.total_tokens * 0.002 / 1000; // 假设每1K token $0.002
    return tokenCost;
  }
}

export const difyWorkflowService = new DifyWorkflowService(
  import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1',
  import.meta.env.VITE_DIFY_API_KEY || ''
);

export const agentWorkflowIntegrator = new AgentWorkflowIntegrator(difyWorkflowService);