
-- Create contact_submissions table to store form submissions
CREATE TABLE public.contact_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    form_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for administrators to view all submissions
CREATE POLICY "Admins can view all contact submissions" 
    ON public.contact_submissions 
    FOR SELECT 
    USING (public.is_super_admin(auth.uid()));

-- Create policy allowing anyone to insert contact submissions (public form)
CREATE POLICY "Anyone can create contact submissions" 
    ON public.contact_submissions 
    FOR INSERT 
    WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
