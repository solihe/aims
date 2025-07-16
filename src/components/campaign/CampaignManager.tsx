// AIMS 战役管理组件
import React, { useState, useEffect } from 'react';
import { useStrategyStore } from '../../stores/useStrategyStore';
import { useContentStore } from '../../stores/useContentStore';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Play, 
  Pause, 
  Copy,
  Calendar,
  Target,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { CampaignStrategy, MarketingObjective } from '../../types';

// 战役状态枚举
export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// 战役状态配置
const statusConfig = {
  [CampaignStatus.DRAFT]: {
    label: '草稿',
    color: 'bg-gray-100 text-gray-800',
    icon: Edit3
  },
  [CampaignStatus.ACTIVE]: {
    label: '进行中',
    color: 'bg-green-100 text-green-800',
    icon: Play
  },
  [CampaignStatus.PAUSED]: {
    label: '已暂停',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Pause
  },
  [CampaignStatus.COMPLETED]: {
    label: '已完成',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle
  },
  [CampaignStatus.ARCHIVED]: {
    label: '已归档',
    color: 'bg-gray-100 text-gray-600',
    icon: XCircle
  }
};

interface CampaignManagerProps {
  onCreateCampaign?: () => void;
  onEditCampaign?: (campaign: CampaignStrategy) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  onCreateCampaign,
  onEditCampaign
}) => {
  const { strategies, currentStrategy, loadStrategies, setCurrentStrategy, deleteStrategy, duplicateStrategy } = useStrategyStore();
  const { clearContentCalendar } = useContentStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  // 扩展策略对象以包含状态信息
  const enrichedCampaigns = strategies.map(strategy => ({
    ...strategy,
    status: strategy.id === currentStrategy?.id ? CampaignStatus.ACTIVE : CampaignStatus.DRAFT,
    progress: Math.floor(Math.random() * 100), // 模拟进度
    totalContent: Math.floor(Math.random() * 50) + 10,
    publishedContent: Math.floor(Math.random() * 30) + 5,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }));

  // 筛选战役
  const filteredCampaigns = enrichedCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.objective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectCampaign = (campaignId: string) => {
    const campaign = strategies.find(s => s.id === campaignId);
    if (campaign) {
      setCurrentStrategy(campaign);
      // 切换战役时清除旧的内容日历
      clearContentCalendar();
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteStrategy(campaignId);
      if (currentStrategy?.id === campaignId) {
        setCurrentStrategy(null);
        clearContentCalendar();
      }
      setShowDeleteModal(null);
    } catch (error) {
      console.error('删除战役失败:', error);
    }
  };

  const handleDuplicateCampaign = async (campaign: CampaignStrategy) => {
    try {
      const duplicatedCampaign = await duplicateStrategy(campaign);
      console.log('战役复制成功:', duplicatedCampaign.name);
    } catch (error) {
      console.error('战役复制失败:', error);
    }
  };

  const getObjectiveLabel = (objective: string) => {
    const labels = {
      'product_launch': '产品发布',
      'brand_building': '品牌建设',
      'lead_generation': '线索获取',
      'sales_conversion': '销售转化',
      'crisis_management': '危机管理'
    };
    return labels[objective as keyof typeof labels] || objective;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">战役管理</h2>
          <p className="text-gray-600 mt-2">管理所有传播战役，创建、编辑和监控战役执行</p>
        </div>
        <button
          onClick={onCreateCampaign}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>创建战役</span>
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索战役名称或目标..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部状态</option>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 战役统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总战役数</p>
              <p className="text-2xl font-bold text-gray-900">{strategies.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrichedCampaigns.filter(c => c.status === CampaignStatus.ACTIVE).length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrichedCampaigns.filter(c => c.status === CampaignStatus.COMPLETED).length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">草稿</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrichedCampaigns.filter(c => c.status === CampaignStatus.DRAFT).length}
              </p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Edit3 className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 战役列表 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">战役列表</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredCampaigns.length === 0 ? (
            <div className="p-8 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无战役</h3>
              <p className="text-gray-600 mb-4">创建您的第一个传播战役开始使用AIMS系统</p>
              <button
                onClick={onCreateCampaign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                创建战役
              </button>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => {
              const StatusIcon = statusConfig[campaign.status].icon;
              const isActive = campaign.id === currentStrategy?.id;
              
              return (
                <div
                  key={campaign.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {campaign.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[campaign.status].color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusConfig[campaign.status].label}
                        </span>
                        {isActive && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            当前战役
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>{getObjectiveLabel(campaign.objective)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{campaign.phases.length}个阶段</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{Object.keys(campaign.platformRoles).length}个平台</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{campaign.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* 进度条 */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>执行进度</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!isActive && (
                        <button
                          onClick={() => handleSelectCampaign(campaign.id)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          选择
                        </button>
                      )}
                      <button
                        onClick={() => onEditCampaign?.(campaign)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDuplicateCampaign(campaign)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        复制
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(campaign.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">确认删除</h3>
              </div>
              <p className="text-gray-600 mb-6">
                确定要删除这个战役吗？此操作无法撤销，相关的内容和数据也将被删除。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteCampaign(showDeleteModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
