
import React, { useState } from 'react';
import { Plus, Play, Settings, Trash2, Copy, ArrowDown } from 'lucide-react';

export const CallFlowBuilder: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState('default');

  const flows = [
    { id: 'default', name: 'Default Sales Flow', status: 'active', calls: 1247 },
    { id: 'premium', name: 'Premium Product Flow', status: 'active', calls: 342 },
    { id: 'demo', name: 'Demo Request Flow', status: 'draft', calls: 0 },
  ];

  const flowSteps = [
    {
      id: 1,
      type: 'greeting',
      title: 'Greeting & Introduction',
      description: 'AI introduces itself and asks for basic lead information',
      settings: {
        script: 'Hi! This is Sarah from LeadFlow AI. I\'m calling about your recent inquiry...',
        voice: 'Professional Female',
        duration: '30-45 seconds'
      }
    },
    {
      id: 2,
      type: 'qualification',
      title: 'Lead Qualification',
      description: 'Ask qualifying questions to assess lead quality',
      settings: {
        questions: ['What\'s your budget range?', 'When are you looking to start?', 'Who makes the decisions?'],
        minScore: 60,
        maxDuration: '3 minutes'
      }
    },
    {
      id: 3,
      type: 'decision',
      title: 'Qualification Decision',
      description: 'AI decides next steps based on responses',
      settings: {
        qualified: 'Schedule demo',
        notQualified: 'Send information',
        needsCallback: 'Schedule callback'
      }
    },
    {
      id: 4,
      type: 'action',
      title: 'Next Steps',
      description: 'Execute the appropriate action based on qualification',
      settings: {
        calendar: 'Google Calendar',
        crm: 'Pipedrive',
        followUp: 'WhatsApp + Email'
      }
    }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'greeting': return '👋';
      case 'qualification': return '❓';
      case 'decision': return '🎯';
      case 'action': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Call Flow Builder</h1>
          <p className="text-muted-foreground">Design intelligent conversation flows for your AI calls</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-border px-4 py-2 rounded-lg hover:bg-muted">
            <Copy className="w-4 h-4" />
            <span>Duplicate Flow</span>
          </button>
          <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            <span>New Flow</span>
          </button>
        </div>
      </div>

      {/* Flow Selector */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-foreground">Current Flow:</label>
          <select
            value={selectedFlow}
            onChange={(e) => setSelectedFlow(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {flows.map((flow) => (
              <option key={flow.id} value={flow.id}>
                {flow.name} ({flow.status})
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 text-sm">
              <Play className="w-4 h-4" />
              <span>Test Flow</span>
            </button>
            <button className="flex items-center space-x-2 border border-border px-3 py-2 rounded-lg hover:bg-muted text-sm">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-700">1,247</p>
            <p className="text-sm text-muted-foreground">Total Calls</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-700">68%</p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-700">4:32</p>
            <p className="text-sm text-muted-foreground">Avg Duration</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-700">34%</p>
            <p className="text-sm text-muted-foreground">Qualified Rate</p>
          </div>
        </div>
      </div>

      {/* Flow Builder */}
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Flow Steps</h3>
          <p className="text-sm text-muted-foreground">Drag and drop to reorder steps</p>
        </div>
        
        <div className="p-6 space-y-4">
          {flowSteps.map((step, index) => (
            <div key={step.id}>
              <div className="bg-muted border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-2 rounded-lg border border-border">
                      <span className="text-xl">{getStepIcon(step.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      
                      {/* Step Settings Preview */}
                      <div className="bg-white p-3 rounded border border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {Object.entries(step.settings).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                              <span className="text-muted-foreground">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="text-brand-700 hover:text-brand-800 p-2">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="text-destructive hover:text-destructive p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {index < flowSteps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {/* Add Step Button */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-brand-300 transition-colors">
            <button className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-brand-700">
              <Plus className="w-5 h-5" />
              <span>Add New Step</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Voice & AI Settings</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Voice Type</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                <option>Professional Female (Sarah)</option>
                <option>Professional Male (David)</option>
                <option>Friendly Female (Emma)</option>
                <option>Authoritative Male (James)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Speaking Speed</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                <option>Normal</option>
                <option>Slow</option>
                <option>Fast</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Personality</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                <option>Professional</option>
                <option>Friendly</option>
                <option>Enthusiastic</option>
                <option>Calm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Language</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
