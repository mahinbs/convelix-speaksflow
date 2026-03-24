
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Users, Clock, TrendingUp, Mic, PhoneCall } from 'lucide-react';
import { useVapiAIAssistants } from '@/hooks/useVapiAIAssistants';
import { useVapiAICalls } from '@/hooks/useVapiAICalls';
import { useVapiAIPhoneNumbers } from '@/hooks/useVapiAIPhoneNumbers';

export const VapiAIDashboard: React.FC = () => {
  const { data: assistants = [] } = useVapiAIAssistants();
  const { data: calls = [] } = useVapiAICalls();
  const { data: phoneNumbers = [] } = useVapiAIPhoneNumbers();

  const activeCalls = calls.filter(call => call.status === 'in-progress').length;
  const totalCallsToday = calls.filter(call => {
    const today = new Date().toDateString();
    return new Date(call.created_at).toDateString() === today;
  }).length;

  const avgCallDuration = calls.length > 0 
    ? Math.round(calls.reduce((sum, call) => sum + (call.duration || 0), 0) / calls.length) 
    : 0;

  const successfulCalls = calls.filter(call => call.status === 'completed').length;
  const successRate = calls.length > 0 ? Math.round((successfulCalls / calls.length) * 100) : 0;

  const stats = [
    {
      title: 'Active Calls',
      value: activeCalls,
      icon: PhoneCall,
      description: 'Live conversations',
      gradient: 'from-brand-400/20 via-brand-500/20 to-brand-600/20',
      textColor: 'text-brand-700'
    },
    {
      title: 'AI Assistants',
      value: assistants.length,
      icon: Users,
      description: 'Voice assistants configured',
      gradient: 'from-brand-500/20 via-brand-600/20 to-brand-700/20',
      textColor: 'text-brand-700'
    },
    {
      title: 'Phone Numbers',
      value: phoneNumbers.length,
      icon: Phone,
      description: 'Numbers provisioned',
      gradient: 'from-brand-300/20 via-brand-500/20 to-brand-700/20',
      textColor: 'text-brand-700'
    },
    {
      title: 'Calls Today',
      value: totalCallsToday,
      icon: TrendingUp,
      description: 'In the last 24 hours',
      gradient: 'from-brand-200/25 via-brand-400/20 to-brand-600/20',
      textColor: 'text-brand-700'
    }
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`group relative overflow-hidden stagger-animation stagger-${index + 1}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60 group-hover:opacity-80 transition-all duration-700`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground/90">{stat.title}</CardTitle>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 backdrop-blur-sm pulse-glow`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-4xl font-bold counter-animation ${stat.textColor} animate-counter`}>{stat.value}</div>
                <p className="text-sm text-muted-foreground/80 mt-2 slide-in-elegant">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="group slide-up-fade">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-700/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-brand-500/20 to-brand-700/20 gentle-bounce">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span>Call Performance</span>
            </CardTitle>
            <CardDescription>Average metrics for your voice calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-brand-50/90 to-secondary/80 border border-brand-100/50 glass-card-elegant hover-scale-elegant">
              <span className="text-sm font-semibold">Average Duration</span>
              <span className="text-2xl font-bold text-brand-700 animate-counter">{avgCallDuration}s</span>
            </div>
            <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-brand-100/80 to-brand-50/80 border border-brand-100/50 glass-card-elegant hover-scale-elegant">
              <span className="text-sm font-semibold">Success Rate</span>
              <span className="text-2xl font-bold text-brand-700 animate-counter">{successRate}%</span>
            </div>
            <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-secondary/90 to-brand-50/80 border border-brand-100/50 glass-card-elegant hover-scale-elegant">
              <span className="text-sm font-semibold">Total Calls</span>
              <span className="text-2xl font-bold text-brand-700 animate-counter">{calls.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group slide-up-fade">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-800/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-brand-500/20 to-brand-800/20 gentle-bounce">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest voice assistant activity</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-6">
              {calls.slice(0, 5).map((call, index) => (
                <div 
                  key={call.id} 
                  className={`flex items-center justify-between p-6 bg-gradient-to-r from-muted/90 to-secondary/80 rounded-2xl border border-border/50 glass-card-elegant hover:shadow-xl transition-all duration-500 stagger-animation`} 
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {call.caller_phone_number || call.destination_phone_number}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{call.type} call</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-4 py-2 rounded-full font-semibold transition-all duration-300 hover-scale-elegant ${
                      call.status === 'completed' ? 'bg-brand-100/80 text-brand-800 backdrop-blur-sm' :
                      call.status === 'in-progress' ? 'bg-brand-100/80 text-brand-800 backdrop-blur-sm' :
                      'bg-muted/80 text-foreground backdrop-blur-sm'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                </div>
              ))}
              {calls.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  <div className="p-6 rounded-full bg-gradient-to-r from-brand-500/10 to-brand-700/10 mx-auto w-fit mb-6 float-animation">
                    <Mic className="h-16 w-16 opacity-50" />
                  </div>
                  <p className="text-lg">No calls yet. Create an assistant to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
