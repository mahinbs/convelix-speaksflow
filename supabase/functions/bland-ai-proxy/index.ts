import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header (Supabase token)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Get the request details
    const { endpoint, method = 'GET', body, apiKey: providedApiKey } = await req.json()

    if (!endpoint) {
      throw new Error('Missing endpoint parameter')
    }

    // Get API key - either from request or from settings table
    let apiKey = providedApiKey
    
    if (!apiKey) {
      // Try user-specific key first
      const userSpecificKey = `bland_ai_api_key_${user.id}`
      let { data: settings } = await supabaseClient
        .from('settings')
        .select('value')
        .eq('key', userSpecificKey)
        .single()

      // Fall back to global key if user-specific key not found
      if (!settings) {
        ({ data: settings } = await supabaseClient
          .from('settings')
          .select('value')
          .eq('key', 'bland_ai_api_key')
          .single())
      }

      if (!settings?.value) {
        throw new Error('Bland AI API key not configured')
      }

      apiKey = settings.value
    }

    // Make the request to Bland AI
    const blandAIUrl = `https://api.bland.ai/v1${endpoint}`
    console.log(`Proxying request to: ${blandAIUrl}`)

    const blandAIResponse = await fetch(blandAIUrl, {
      method: method,
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData = await blandAIResponse.json().catch(() => ({}))

    if (!blandAIResponse.ok) {
      console.error('Bland AI API error:', responseData)
      return new Response(
        JSON.stringify({
          error: responseData.message || responseData.error || 'Bland AI API request failed',
          status: blandAIResponse.status,
          details: responseData
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: blandAIResponse.status
        }
      )
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in bland-ai-proxy:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

