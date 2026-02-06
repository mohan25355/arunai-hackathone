import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Brain, 
  Database,
  Key,
  Bell,
  Users,
  ToggleRight,
  ToggleLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: typeof Settings;
}

const sections: SettingSection[] = [
  { id: 'general', title: 'General', description: 'Basic platform configuration', icon: Settings },
  { id: 'models', title: 'AI Models', description: 'Model selection and parameters', icon: Brain },
  { id: 'governance', title: 'Governance', description: 'Default governance settings', icon: Shield },
  { id: 'database', title: 'Knowledge Base', description: 'Vector database settings', icon: Database },
  { id: 'api', title: 'API Keys', description: 'External service credentials', icon: Key },
  { id: 'notifications', title: 'Notifications', description: 'Alert and notification settings', icon: Bell },
  { id: 'team', title: 'Team', description: 'User and role management', icon: Users },
];

export function SettingsPanel() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    autoApprove: false,
    requireReviewHighRisk: true,
    enableBiasDetection: true,
    enableHallucinationCheck: true,
    defaultModel: 'gemini-2.5-flash',
    confidenceThreshold: 80,
    maxTokens: 2048,
    temperature: 0.7,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure platform behavior and integrations</p>
        </div>
        <Button variant="glow" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[280px_1fr] gap-6 min-h-0">
        {/* Section Navigation */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Configuration</h3>
          </div>
          <div className="p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-foreground'
                )}
              >
                <section.icon className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{section.title}</p>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="glass-card overflow-y-auto scrollbar-thin">
          {activeSection === 'general' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Auto-Approve Low Risk</p>
                      <p className="text-sm text-muted-foreground">Automatically approve responses below risk threshold</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
                      className="shrink-0"
                    >
                      {settings.autoApprove ? (
                        <ToggleRight className="w-10 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-10 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Require Review for High Risk</p>
                      <p className="text-sm text-muted-foreground">Force human review for high-risk responses</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, requireReviewHighRisk: !settings.requireReviewHighRisk })}
                      className="shrink-0"
                    >
                      {settings.requireReviewHighRisk ? (
                        <ToggleRight className="w-10 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-10 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Enable Bias Detection</p>
                      <p className="text-sm text-muted-foreground">Analyze responses for potential bias</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, enableBiasDetection: !settings.enableBiasDetection })}
                      className="shrink-0"
                    >
                      {settings.enableBiasDetection ? (
                        <ToggleRight className="w-10 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-10 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Enable Hallucination Check</p>
                      <p className="text-sm text-muted-foreground">Validate responses against knowledge base</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, enableHallucinationCheck: !settings.enableHallucinationCheck })}
                      className="shrink-0"
                    >
                      {settings.enableHallucinationCheck ? (
                        <ToggleRight className="w-10 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-10 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'models' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Model Configuration</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <label className="text-sm font-medium mb-2 block">Default Model</label>
                    <select
                      value={settings.defaultModel}
                      onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                      <option value="gpt-5">GPT-5</option>
                      <option value="gpt-5-mini">GPT-5 Mini</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Confidence Threshold</label>
                      <Badge variant="outline" className="font-mono">{settings.confidenceThreshold}%</Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.confidenceThreshold}
                      onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseInt(e.target.value) })}
                      className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Responses below this threshold require human review
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Temperature</label>
                      <Badge variant="outline" className="font-mono">{settings.temperature}</Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                      className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Lower values produce more focused, deterministic outputs
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50">
                    <label className="text-sm font-medium mb-2 block">Max Tokens</label>
                    <input
                      type="number"
                      value={settings.maxTokens}
                      onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum number of tokens in generated responses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'general' && activeSection !== 'models' && (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
              <Settings className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {sections.find(s => s.id === activeSection)?.title} Settings
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Configuration options for this section will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
