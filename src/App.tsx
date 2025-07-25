import React, { useState } from 'react';
import { Zap, Target, BarChart3, Settings, Brain, Briefcase, Search } from 'lucide-react';
import { StrategyPlanner } from './components/strategy/StrategyPlanner';
import { LLMSettings } from './components/llm/LLMSettings';
import { ContentOrchestration } from './components/orchestration/ContentOrchestration';
import { ContentWorkspace } from './components/workspace/ContentWorkspace';
import { EffectAnalytics } from './components/analytics/EffectAnalytics';
import { CampaignManager } from './components/campaign/CampaignManager';
import { LeadHunter } from './components/leads/LeadHunter';
import { useStrategyStore } from './stores/useStrategyStore';
import { CampaignStrategy } from './types';

function App() {
  const [currentView, setCurrentView] = useState('campaigns');
  const { currentStrategy, setCurrentStrategy } = useStrategyStore();

  const renderView = () => {
    switch (currentView) {
      case 'campaigns':
        return (
          <CampaignManager
            onCreateCampaign={() => setCurrentView('strategy')}
            onEditCampaign={(campaign: CampaignStrategy) => {
              setCurrentStrategy(campaign);
              setCurrentView('strategy');
            }}
          />
        );
      case 'strategy':
        return (
          <StrategyPlanner
            onNavigateToOrchestration={() => setCurrentView('orchestration')}
            onNavigateToCampaigns={() => setCurrentView('campaigns')}
          />
        );
      case 'orchestration':
        return <ContentOrchestration onNavigateToWorkspace={() => setCurrentView('content')} />;
      case 'content':
        return <ContentWorkspace onNavigateToAnalytics={() => setCurrentView('analytics')} />;
      case 'analytics':
        return <EffectAnalytics />;
      case 'leads':
        return <LeadHunter />;
      case 'llm-settings':
        return <LLMSettings />;
      default:
        return (
          <CampaignManager
            onCreateCampaign={() => setCurrentView('strategy')}
            onEditCampaign={(campaign: CampaignStrategy) => {
              setCurrentStrategy(campaign);
              setCurrentView('strategy');
            }}
          />
        );
    }
  };

  const navigationItems = [
    { id: 'campaigns', label: '战役管理', icon: Briefcase },
    { id: 'strategy', label: '策略制定', icon: Target },
    { id: 'orchestration', label: '内容编排', icon: Zap },
    { id: 'content', label: '内容工作区', icon: Settings },
    { id: 'analytics', label: '效果分析', icon: BarChart3 },
    { id: 'leads', label: '线索猎手', icon: Search },
    { id: 'llm-settings', label: 'LLM设置', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                AIMS - 战略性内容编排系统
              </h1>
            </div>
            <div className="flex items-center space-x-1">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors ${
                    currentView === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;


