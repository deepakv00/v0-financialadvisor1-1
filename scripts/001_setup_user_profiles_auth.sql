-- Enable RLS on user_profiles table and add authentication policies
-- This ensures users can only access their own profile data

-- First, ensure the user_profiles table has proper foreign key to auth.users
-- The table already exists, so we'll add the foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    -- Check if foreign key constraint exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_id_fkey' 
        AND table_name = 'user_profiles'
    ) THEN
        -- Add foreign key constraint to reference auth.users
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_delete_own_profile" ON public.user_profiles;

-- Create RLS policies for user_profiles
CREATE POLICY "users_can_view_own_profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_can_delete_own_profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = id);
