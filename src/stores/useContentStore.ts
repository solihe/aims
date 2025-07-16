// AIMS 内容状态管理
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ContentState, ContentMatrix, ContentRequest, CampaignStrategy } from '../types';
import { contentService } from '../services/content/contentService';

// 内容日历项目类型
export interface ContentCalendarItem {
  id: string;
  week: number;
  day: number;
  platform: string;
  contentType: string;
  title: string;
  content: string;
  hashtags?: string[];
  mentions?: string[];
  mediaRequirements?: string;
  publishTime: string;
  phase: string;
  objective: string;
  status: 'draft' | 'approved' | 'published';
}

interface ContentStore extends ContentState {
  // 内容日历相关
  contentCalendar: ContentCalendarItem[] | null;
  generateContentCalendar: (strategy: CampaignStrategy) => Promise<void>;
  updateCalendarItem: (itemId: string, updates: Partial<ContentCalendarItem>) => void;

  // 原有Actions
  generateContent: (request: ContentRequest) => Promise<ContentMatrix>;
  updateContent: (matrixId: string, platformId: string, content: string) => Promise<void>;
  approveContent: (matrixId: string, platformId: string) => Promise<void>;
  publishContent: (matrixId: string, platformId: string) => Promise<void>;
  loadMatrices: () => Promise<void>;
  setCurrentMatrix: (matrix: ContentMatrix | null) => void;
  setGenerating: (generating: boolean) => void;
}

export const useContentStore = create<ContentStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentMatrix: null,
      matrices: [],
      isGenerating: false,
      contentCalendar: null,

      // 内容日历Actions
      generateContentCalendar: async (strategy: CampaignStrategy) => {
        set({ isGenerating: true });
        try {
          const calendar = await contentService.generateContentCalendar(strategy);
          set({ contentCalendar: calendar, isGenerating: false });
        } catch (error) {
          set({ isGenerating: false });
          throw error;
        }
      },

      updateCalendarItem: (itemId: string, updates: Partial<ContentCalendarItem>) => {
        set((state) => ({
          contentCalendar: state.contentCalendar?.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ) || null
        }));
      },

      // 原有Actions
      generateContent: async (request: ContentRequest) => {
        set({ isGenerating: true });
        try {
          const matrix = await contentService.generateContent(request);
          set((state) => ({
            currentMatrix: matrix,
            matrices: [matrix, ...state.matrices],
            isGenerating: false,
          }));
          return matrix;
        } catch (error) {
          set({ isGenerating: false });
          throw error;
        }
      },

      updateContent: async (matrixId: string, platformId: string, content: string) => {
        try {
          const updatedMatrix = await contentService.updateContent(matrixId, platformId, content);
          set((state) => ({
            matrices: state.matrices.map((m) =>
              m.id === matrixId ? updatedMatrix : m
            ),
            currentMatrix:
              state.currentMatrix?.id === matrixId ? updatedMatrix : state.currentMatrix,
          }));
        } catch (error) {
          throw error;
        }
      },

      approveContent: async (matrixId: string, platformId: string) => {
        try {
          const updatedMatrix = await contentService.approveContent(matrixId, platformId);
          set((state) => ({
            matrices: state.matrices.map((m) =>
              m.id === matrixId ? updatedMatrix : m
            ),
            currentMatrix:
              state.currentMatrix?.id === matrixId ? updatedMatrix : state.currentMatrix,
          }));
        } catch (error) {
          throw error;
        }
      },

      publishContent: async (matrixId: string, platformId: string) => {
        try {
          const updatedMatrix = await contentService.publishContent(matrixId, platformId);
          set((state) => ({
            matrices: state.matrices.map((m) =>
              m.id === matrixId ? updatedMatrix : m
            ),
            currentMatrix:
              state.currentMatrix?.id === matrixId ? updatedMatrix : state.currentMatrix,
          }));
        } catch (error) {
          throw error;
        }
      },

      loadMatrices: async () => {
        try {
          const matrices = await contentService.getMatrices();
          set({ matrices });
        } catch (error) {
          throw error;
        }
      },

      setCurrentMatrix: (matrix) => set({ currentMatrix: matrix }),
      setGenerating: (generating) => set({ isGenerating: generating }),
    }),
    {
      name: 'content-store',
    }
  )
);
