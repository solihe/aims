// AIMS 内容状态管理
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ContentState, ContentMatrix, ContentRequest } from '../types';
import { contentService } from '../services/content/contentService';

interface ContentStore extends ContentState {
  // Actions
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

      // Actions
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
