
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { AIAnalysis } from './types.ts';

export class DatabaseService {
  private supabase;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async updateCallAnalysis(callId: string, analysis: AIAnalysis, leadScore: number, qualificationStatus: string) {
    const { error: updateError } = await this.supabase
      .from('bland_ai_calls')
      .update({
        ai_analysis: analysis,
        lead_score: leadScore,
        qualification_status: qualificationStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', callId);

    if (updateError) {
      console.error('Error updating call record:', updateError);
      throw new Error('Failed to update call record');
    }

    return true;
  }

  async updateLeadStatus(callId: string, qualificationStatus: string) {
    const { data: callData } = await this.supabase
      .from('bland_ai_calls')
      .select('lead_id')
      .eq('id', callId)
      .single();

    if (callData?.lead_id) {
      let newLeadStatus = 'contacted';
      
      if (qualificationStatus === 'Hot') {
        newLeadStatus = 'qualified';
      } else if (qualificationStatus === 'Unqualified') {
        newLeadStatus = 'cold';
      }

      await this.supabase
        .from('leads')
        .update({ 
          status: newLeadStatus,
          last_contact_at: new Date().toISOString()
        })
        .eq('id', callData.lead_id);
    }
  }
}
