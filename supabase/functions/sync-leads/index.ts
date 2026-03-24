
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { sourceType } = await req.json()
    
    console.log(`Starting sync for ${sourceType} for user ${user.id}`)

    // Create sync log entry
    const { data: syncLog, error: logError } = await supabase
      .from('integration_sync_logs')
      .insert({
        user_id: user.id,
        source_type: sourceType,
        sync_status: 'in_progress'
      })
      .select()
      .single()

    if (logError) {
      console.error('Error creating sync log:', logError)
      throw new Error('Failed to create sync log')
    }

    // Get credentials for this integration
    const { data: credentials, error: credError } = await supabase
      .from('integration_credentials')
      .select('*')
      .eq('user_id', user.id)
      .eq('source_type', sourceType)
      .eq('is_active', true)
      .single()

    if (credError || !credentials) {
      await updateSyncLog(syncLog.id, 'error', 0, 'No valid credentials found')
      throw new Error('No valid credentials found for this integration')
    }

    let syncResult = { leads: [], count: 0 }

    switch (sourceType) {
      case 'facebook':
        syncResult = await syncFacebookLeads(credentials.credentials, user.id)
        break
      case 'linkedin':
        syncResult = await syncLinkedInLeads(credentials.credentials, user.id)
        break
      case 'google_sheets':
        syncResult = await syncGoogleSheetsLeads(credentials.credentials, user.id)
        break
      case 'typeform':
        syncResult = await syncTypeformLeads(credentials.credentials, user.id)
        break
      default:
        throw new Error(`Unsupported source type: ${sourceType}`)
    }

    // Update sync log with success
    await updateSyncLog(syncLog.id, 'success', syncResult.count)

    // Update lead source stats
    await supabase
      .from('lead_sources')
      .update({
        total_leads: syncResult.count,
        last_sync_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('source_type', sourceType)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${syncResult.count} leads`,
        leads_imported: syncResult.count
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error syncing leads:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function updateSyncLog(syncLogId: string, status: string, leadsImported: number, errorMessage?: string) {
  await supabase
    .from('integration_sync_logs')
    .update({
      sync_status: status,
      leads_imported: leadsImported,
      error_message: errorMessage,
      completed_at: new Date().toISOString()
    })
    .eq('id', syncLogId)
}

async function syncFacebookLeads(credentials: any, userId: string) {
  const { accessToken, adAccountId } = credentials
  const leads: any[] = []
  
  try {
    // Fetch leads from Facebook Lead Ads API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${adAccountId}/leadgen_forms?access_token=${accessToken}&fields=leads{field_data,created_time,id}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch Facebook leads')
    }
    
    const data = await response.json()
    
    for (const form of data.data || []) {
      for (const lead of form.leads?.data || []) {
        const leadData = parseFacebookLead(lead)
        
        // Insert lead into database
        const { error } = await supabase
          .from('leads')
          .upsert({
            user_id: userId,
            source: 'facebook',
            source_id: lead.id,
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            lead_data: lead,
            status: 'new',
            score: 75
          })
          
        if (!error) {
          leads.push(leadData)
        }
      }
    }
  } catch (error) {
    console.error('Facebook sync error:', error)
    throw error
  }
  
  return { leads, count: leads.length }
}

async function syncLinkedInLeads(credentials: any, userId: string) {
  // Similar implementation for LinkedIn
  return { leads: [], count: 0 }
}

async function syncGoogleSheetsLeads(credentials: any, userId: string) {
  // Similar implementation for Google Sheets
  return { leads: [], count: 0 }
}

async function syncTypeformLeads(credentials: any, userId: string) {
  const { accessToken, formId } = credentials
  const leads: any[] = []
  
  try {
    // Fetch responses from Typeform API
    const response = await fetch(
      `https://api.typeform.com/forms/${formId}/responses`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch Typeform responses')
    }
    
    const data = await response.json()
    
    for (const response of data.items || []) {
      const leadData = parseTypeformResponse(response)
      
      // Insert lead into database
      const { error } = await supabase
        .from('leads')
        .upsert({
          user_id: userId,
          source: 'typeform',
          source_id: response.response_id,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          lead_data: response,
          status: 'new',
          score: 80
        })
        
      if (!error) {
        leads.push(leadData)
      }
    }
  } catch (error) {
    console.error('Typeform sync error:', error)
    throw error
  }
  
  return { leads, count: leads.length }
}

function parseFacebookLead(lead: any) {
  const fieldData = lead.field_data || []
  const leadData: any = {}
  
  fieldData.forEach((field: any) => {
    switch (field.name?.toLowerCase()) {
      case 'full_name':
      case 'name':
        leadData.name = field.values?.[0]
        break
      case 'email':
        leadData.email = field.values?.[0]
        break
      case 'phone_number':
      case 'phone':
        leadData.phone = field.values?.[0]
        break
      case 'company_name':
      case 'company':
        leadData.company = field.values?.[0]
        break
    }
  })
  
  return leadData
}

function parseTypeformResponse(response: any) {
  const answers = response.answers || []
  const leadData: any = {}
  
  answers.forEach((answer: any) => {
    const fieldType = answer.field?.type
    const value = answer[fieldType] || answer.text || answer.email || answer.phone_number
    
    switch (fieldType) {
      case 'short_text':
        if (answer.field?.ref?.includes('name')) {
          leadData.name = value
        }
        break
      case 'email':
        leadData.email = value
        break
      case 'phone_number':
        leadData.phone = value
        break
    }
  })
  
  return leadData
}
