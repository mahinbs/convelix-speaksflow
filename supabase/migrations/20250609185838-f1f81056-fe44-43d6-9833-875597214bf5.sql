
-- Create table for Vapi.ai assistants
CREATE TABLE public.vapi_ai_assistants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  voice_settings JSONB NOT NULL DEFAULT '{}',
  prompt TEXT NOT NULL,
  functions JSONB DEFAULT '[]',
  model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
  first_message TEXT,
  background_sound TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  vapi_assistant_id TEXT UNIQUE,
  assistant_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Vapi.ai calls
CREATE TABLE public.vapi_ai_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  assistant_id UUID REFERENCES public.vapi_ai_assistants(id),
  phone_number_id UUID,
  vapi_call_id TEXT UNIQUE,
  caller_phone_number TEXT,
  destination_phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  type TEXT NOT NULL DEFAULT 'inbound',
  duration INTEGER,
  cost DECIMAL(10,4),
  transcript TEXT,
  summary TEXT,
  sentiment_analysis JSONB,
  recording_url TEXT,
  call_data JSONB,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Vapi.ai phone numbers
CREATE TABLE public.vapi_ai_phone_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  vapi_phone_number_id TEXT UNIQUE,
  name TEXT,
  assistant_id UUID REFERENCES public.vapi_ai_assistants(id),
  status TEXT NOT NULL DEFAULT 'active',
  monthly_cost DECIMAL(10,2),
  country_code TEXT NOT NULL DEFAULT 'US',
  phone_number_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for vapi_ai_assistants
ALTER TABLE public.vapi_ai_assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assistants" 
  ON public.vapi_ai_assistants 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assistants" 
  ON public.vapi_ai_assistants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assistants" 
  ON public.vapi_ai_assistants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assistants" 
  ON public.vapi_ai_assistants 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for vapi_ai_calls
ALTER TABLE public.vapi_ai_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calls" 
  ON public.vapi_ai_calls 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calls" 
  ON public.vapi_ai_calls 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calls" 
  ON public.vapi_ai_calls 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calls" 
  ON public.vapi_ai_calls 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for vapi_ai_phone_numbers
ALTER TABLE public.vapi_ai_phone_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own phone numbers" 
  ON public.vapi_ai_phone_numbers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own phone numbers" 
  ON public.vapi_ai_phone_numbers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own phone numbers" 
  ON public.vapi_ai_phone_numbers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own phone numbers" 
  ON public.vapi_ai_phone_numbers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_vapi_ai_assistants_updated_at
  BEFORE UPDATE ON public.vapi_ai_assistants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vapi_ai_calls_updated_at
  BEFORE UPDATE ON public.vapi_ai_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vapi_ai_phone_numbers_updated_at
  BEFORE UPDATE ON public.vapi_ai_phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
