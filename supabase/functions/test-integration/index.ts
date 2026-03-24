
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
    const { sourceType, credentials } = await req.json()

    console.log(`Testing connection for ${sourceType}`)

    let testResult = { success: false, message: 'Unknown source type' }

    switch (sourceType) {
      case 'facebook':
        testResult = await testFacebookConnection(credentials)
        break
      case 'linkedin':
        testResult = await testLinkedInConnection(credentials)
        break
      case 'google_sheets':
        testResult = await testGoogleSheetsConnection(credentials)
        break
      case 'typeform':
        testResult = await testTypeformConnection(credentials)
        break
    }

    return new Response(
      JSON.stringify(testResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: testResult.success ? 200 : 400
      }
    )

  } catch (error) {
    console.error('Error testing integration:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function testFacebookConnection(credentials: any) {
  try {
    const { appId, appSecret, accessToken, adAccountId } = credentials
    
    // Test Graph API access
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${adAccountId}?access_token=${accessToken}&fields=name,account_status`
    )
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: `Facebook API error: ${error.error?.message || 'Invalid credentials'}` }
    }
    
    const data = await response.json()
    return { 
      success: true, 
      message: `Connected to ad account: ${data.name}`,
      accountInfo: data
    }
  } catch (error) {
    return { success: false, message: `Facebook connection failed: ${error.message}` }
  }
}

async function testLinkedInConnection(credentials: any) {
  try {
    const { accessToken } = credentials
    
    // Test LinkedIn API access
    const response = await fetch(
      'https://api.linkedin.com/v2/people/~',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: `LinkedIn API error: ${error.message || 'Invalid access token'}` }
    }
    
    const data = await response.json()
    return { 
      success: true, 
      message: `Connected to LinkedIn account`,
      accountInfo: data
    }
  } catch (error) {
    return { success: false, message: `LinkedIn connection failed: ${error.message}` }
  }
}

async function testGoogleSheetsConnection(credentials: any) {
  try {
    const { serviceAccountJson, spreadsheetId } = credentials
    
    // Create JWT for Google API authentication
    const jwt = await createGoogleJWT(serviceAccountJson)
    
    // Test Google Sheets API access
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: `Google Sheets API error: ${error.error?.message || 'Invalid credentials'}` }
    }
    
    const data = await response.json()
    return { 
      success: true, 
      message: `Connected to spreadsheet: ${data.properties?.title}`,
      sheetInfo: data.properties
    }
  } catch (error) {
    return { success: false, message: `Google Sheets connection failed: ${error.message}` }
  }
}

async function testTypeformConnection(credentials: any) {
  try {
    const { accessToken, formId } = credentials
    
    // Test Typeform API access
    const response = await fetch(
      `https://api.typeform.com/forms/${formId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: `Typeform API error: ${error.description || 'Invalid credentials'}` }
    }
    
    const data = await response.json()
    return { 
      success: true, 
      message: `Connected to form: ${data.title}`,
      formInfo: data
    }
  } catch (error) {
    return { success: false, message: `Typeform connection failed: ${error.message}` }
  }
}

async function createGoogleJWT(serviceAccount: any) {
  // This is a simplified JWT creation for Google API
  // In production, you'd use a proper JWT library
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }))
  
  // Note: This is a placeholder. In a real implementation,
  // you'd need to properly sign the JWT with the private key
  return 'mock_jwt_token'
}
