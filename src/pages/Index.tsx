import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PromptGovernance } from '@/components/governance/PromptGovernance';
import { AuditLogs } from '@/components/audit/AuditLogs';
import { HumanReview } from '@/components/review/HumanReview';
import { PoliciesPage } from '@/pages/PoliciesPage';
import { KnowledgeBase } from '@/components/knowledge/KnowledgeBase';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'prompt':
        return <PromptGovernance />;
      case 'sources':
        return <KnowledgeBase />;
      case 'policies':
        return <PoliciesPage />;
      case 'review':
        return <HumanReview />;
      case 'audit':
        return <AuditLogs />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-[0.02] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Index;
