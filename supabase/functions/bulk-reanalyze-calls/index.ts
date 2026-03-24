
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail } = await req.json();

    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: 'User email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting bulk reanalysis for user: ${userEmail}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from email
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const user = authUser.users.find(u => u.email === userEmail);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all completed calls for this user that have transcripts
    const { data: calls, error: callsError } = await supabase
      .from('bland_ai_calls')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('transcript', 'is', null);

    if (callsError) throw callsError;

    console.log(`Found ${calls?.length || 0} calls to reanalyze for user ${userEmail}`);

    if (!calls || calls.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No calls found to reanalyze',
          processed: 0,
          total: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let processed = 0;
    let errors = 0;

    // Process each call
    for (const call of calls) {
      try {
        console.log(`Reanalyzing call ${call.id} (${processed + 1}/${calls.length})`);
        
        // Reset the analysis fields to force reanalysis
        const { error: resetError } = await supabase
          .from('bland_ai_calls')
          .update({
            ai_analysis: null,
            lead_score: null,
            qualification_status: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', call.id);

        if (resetError) {
          console.error(`Error resetting call ${call.id}:`, resetError);
          errors++;
          continue;
        }

        // Trigger analysis
        const { error: analysisError } = await supabase.functions.invoke('analyze-call-transcript', {
          body: {
            callId: call.id,
            transcript: call.transcript
          }
        });

        if (analysisError) {
          console.error(`Error analyzing call ${call.id}:`, analysisError);
          errors++;
        } else {
          processed++;
          console.log(`Successfully triggered reanalysis for call ${call.id}`);
        }

        // Add small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing call ${call.id}:`, error);
        errors++;
      }
    }

    console.log(`Bulk reanalysis completed: ${processed} processed, ${errors} errors`);

    return new Response(
      JSON.stringify({ 
        message: 'Bulk reanalysis completed',
        processed,
        errors,
        total: calls.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bulk reanalysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
