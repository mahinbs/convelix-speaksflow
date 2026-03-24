
-- Add AI analysis columns to bland_ai_calls table
ALTER TABLE public.bland_ai_calls 
ADD COLUMN ai_analysis JSONB DEFAULT NULL,
ADD COLUMN lead_score INTEGER DEFAULT NULL,
ADD COLUMN qualification_status TEXT DEFAULT NULL;

-- Add AI insights columns to leads table for persistent scoring
ALTER TABLE public.leads 
ADD COLUMN ai_lead_score INTEGER DEFAULT NULL,
ADD COLUMN ai_insights JSONB DEFAULT NULL,
ADD COLUMN last_analysis_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for performance on lead scoring queries
CREATE INDEX idx_bland_ai_calls_lead_score ON public.bland_ai_calls(lead_score) WHERE lead_score IS NOT NULL;
CREATE INDEX idx_leads_ai_lead_score ON public.leads(ai_lead_score) WHERE ai_lead_score IS NOT NULL;
