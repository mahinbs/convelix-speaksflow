
-- Drop all dependent triggers first
DROP TRIGGER IF EXISTS on_profile_created_activation ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS after_user_created_activation ON auth.users CASCADE;

-- Now safely drop the function
DROP FUNCTION IF EXISTS public.handle_new_user_activation() CASCADE;

-- Ensure the activation_status type exists with correct values
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activation_status') THEN
        CREATE TYPE public.activation_status AS ENUM ('pending', 'active', 'suspended');
    END IF;
END $$;

-- Recreate the function with proper enum casting
CREATE OR REPLACE FUNCTION public.handle_new_user_activation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.user_activation_status (profile_id, status)
    VALUES (NEW.id, 'pending'::public.activation_status);
    RETURN NEW;
END;
$function$;

-- Recreate the trigger on the profiles table (this seems to be where it was originally)
CREATE TRIGGER on_profile_created_activation
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_activation();
