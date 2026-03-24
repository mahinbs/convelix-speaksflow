
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source: string;
  source_id?: string;
  campaign_id?: string;
  lead_data?: any;
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the source type from URL path or headers
    const url = new URL(req.url);
    const sourceType = url.searchParams.get('source') || 'unknown';
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json();
    console.log('Received webhook data:', { sourceType, body });

    // Process lead data based on source type
    let leadData: LeadData;

    switch (sourceType) {
      case 'facebook':
        leadData = processFacebookLead(body, userId);
        break;
      case 'google_forms':
        leadData = processGoogleFormsLead(body, userId);
        break;
      case 'typeform':
        leadData = processTypeformLead(body, userId);
        break;
      case 'whatsapp':
        leadData = processWhatsAppLead(body, userId);
        break;
      case 'linkedin':
        leadData = processLinkedInLead(body, userId);
        break;
      case 'google_sheets':
        leadData = processGoogleSheetsLead(body, userId);
        break;
      default:
        leadData = processGenericLead(body, userId, sourceType);
    }

    // Calculate lead score
    leadData.score = calculateLeadScore(leadData);

    // Insert lead into database
    const { data, error } = await supabaseClient
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save lead' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log activity
    await supabaseClient
      .from('lead_activities')
      .insert([{
        lead_id: data.id,
        user_id: userId,
        activity_type: 'imported',
        description: `Lead imported from ${sourceType}`,
        metadata: { source_data: body }
      }]);

    // Update lead source statistics
    await supabaseClient
      .from('lead_sources')
      .update({ 
        total_leads: supabaseClient.rpc('increment', { x: 1 }),
        last_sync_at: new Date().toISOString()
      })
      .eq('source_type', sourceType)
      .eq('user_id', userId);

    return new Response(
      JSON.stringify({ success: true, lead_id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function processFacebookLead(data: any, userId: string): LeadData {
  const leadgen = data.entry?.[0]?.changes?.[0]?.value?.leadgen_id;
  return {
    name: data.field_data?.find((f: any) => f.name === 'full_name')?.values?.[0] || '',
    email: data.field_data?.find((f: any) => f.name === 'email')?.values?.[0] || '',
    phone: data.field_data?.find((f: any) => f.name === 'phone_number')?.values?.[0] || '',
    source: 'facebook',
    source_id: leadgen,
    campaign_id: data.ad_id,
    lead_data: data,
    user_id: userId
  };
}

function processGoogleFormsLead(data: any, userId: string): LeadData {
  return {
    name: data.name || data.full_name || '',
    email: data.email || '',
    phone: data.phone || data.phone_number || '',
    company: data.company || '',
    source: 'google_forms',
    source_id: data.response_id,
    lead_data: data,
    user_id: userId
  };
}

function processTypeformLead(data: any, userId: string): LeadData {
  const answers = data.form_response?.answers || [];
  return {
    name: answers.find((a: any) => a.field?.type === 'short_text' && a.field?.ref === 'name')?.text || '',
    email: answers.find((a: any) => a.field?.type === 'email')?.email || '',
    phone: answers.find((a: any) => a.field?.type === 'phone_number')?.phone_number || '',
    source: 'typeform',
    source_id: data.form_response?.token,
    campaign_id: data.form_response?.form_id,
    lead_data: data,
    user_id: userId
  };
}

function processWhatsAppLead(data: any, userId: string): LeadData {
  return {
    name: data.profile?.name || data.contact?.name || '',
    phone: data.from || data.phone || '',
    source: 'whatsapp',
    source_id: data.id,
    lead_data: data,
    user_id: userId
  };
}

function processLinkedInLead(data: any, userId: string): LeadData {
  return {
    name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.emailAddress || '',
    phone: data.phoneNumber || '',
    company: data.companyName || '',
    job_title: data.jobTitle || '',
    source: 'linkedin',
    source_id: data.leadId,
    campaign_id: data.campaignId,
    lead_data: data,
    user_id: userId
  };
}

function processGoogleSheetsLead(data: any, userId: string): LeadData {
  return {
    name: data.Name || data.name || '',
    email: data.Email || data.email || '',
    phone: data.Phone || data.phone || '',
    company: data.Company || data.company || '',
    source: 'google_sheets',
    source_id: data.row_id,
    lead_data: data,
    user_id: userId
  };
}

function processGenericLead(data: any, userId: string, source: string): LeadData {
  return {
    name: data.name || data.full_name || '',
    email: data.email || '',
    phone: data.phone || data.phone_number || '',
    company: data.company || '',
    job_title: data.job_title || data.title || '',
    source: source,
    source_id: data.id || data.lead_id,
    campaign_id: data.campaign_id,
    lead_data: data,
    user_id: userId
  };
}

function calculateLeadScore(lead: LeadData): number {
  let score = 0;
  
  // Base score by source quality
  const sourceScores: { [key: string]: number } = {
    'linkedin': 30,
    'facebook': 25,
    'google_forms': 20,
    'typeform': 20,
    'whatsapp': 15,
    'google_sheets': 10
  };
  
  score += sourceScores[lead.source] || 10;
  
  // Add points for complete information
  if (lead.email) score += 20;
  if (lead.phone) score += 15;
  if (lead.name) score += 10;
  if (lead.company) score += 15;
  if (lead.job_title) score += 10;
  
  return Math.min(score, 100); // Cap at 100
}
