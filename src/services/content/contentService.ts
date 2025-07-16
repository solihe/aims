// AIMS 内容服务
import { ContentRequest, ContentMatrix, PlatformContent, ApiResponse } from '../../types';
import { apiClient } from '../api/apiClient';

class ContentService {
  // 生成内容矩阵
  async generateContent(request: ContentRequest): Promise<ContentMatrix> {
    try {
      const response = await apiClient.post<ApiResponse<ContentMatrix>>('/api/content/generate', request);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容生成失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容生成失败:', error);
      throw error;
    }
  }

  // 更新内容
  async updateContent(matrixId: string, platformId: string, content: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.put<ApiResponse<ContentMatrix>>(`/api/content/${matrixId}/platforms/${platformId}`, {
        content
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容更新失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容更新失败:', error);
      throw error;
    }
  }

  // 审批内容
  async approveContent(matrixId: string, platformId: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.post<ApiResponse<ContentMatrix>>(`/api/content/${matrixId}/platforms/${platformId}/approve`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容审批失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容审批失败:', error);
      throw error;
    }
  }

  // 发布内容
  async publishContent(matrixId: string, platformId: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.post<ApiResponse<ContentMatrix>>(`/api/content/${matrixId}/platforms/${platformId}/publish`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容发布失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容发布失败:', error);
      throw error;
    }
  }

  // 获取内容矩阵列表
  async getMatrices(): Promise<ContentMatrix[]> {
    try {
      const response = await apiClient.get<ApiResponse<ContentMatrix[]>>('/api/content');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取内容列表失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取内容列表失败:', error);
      throw error;
    }
  }

  // 获取单个内容矩阵
  async getMatrix(id: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.get<ApiResponse<ContentMatrix>>(`/api/content/${id}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取内容失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取内容失败:', error);
      throw error;
    }
  }

  // 删除内容矩阵
  async deleteMatrix(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/content/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || '删除内容失败');
      }
    } catch (error) {
      console.error('删除内容失败:', error);
      throw error;
    }
  }

  // 检查内容质量
  async checkQuality(content: string, platform: string): Promise<{
    score: number;
    suggestions: string[];
    issues: string[];
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        score: number;
        suggestions: string[];
        issues: string[];
      }>>('/api/content/quality-check', { content, platform });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '质量检查失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('质量检查失败:', error);
      throw error;
    }
  }

  // 优化内容
  async optimizeContent(content: string, platform: string, goal: string): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponse<{ optimizedContent: string }>>('/api/content/optimize', {
        content,
        platform,
        goal
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容优化失败');
      }
      
      return response.data.data.optimizedContent;
    } catch (error) {
      console.error('内容优化失败:', error);
      throw error;
    }
  }

  // 预览内容效果
  async previewPerformance(content: PlatformContent): Promise<{
    expectedReach: number;
    expectedEngagement: number;
    confidence: number;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        expectedReach: number;
        expectedEngagement: number;
        confidence: number;
      }>>('/api/content/preview-performance', content);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '效果预览失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('效果预览失败:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();
