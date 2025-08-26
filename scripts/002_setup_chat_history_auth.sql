-- Enable RLS on chat_history table and add authentication policies
-- This ensures users can only access their own chat history

-- Enable Row Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_view_own_chat_history" ON public.chat_history;
DROP POLICY IF EXISTS "users_can_insert_own_chat_history" ON public.chat_history;
DROP POLICY IF EXISTS "users_can_update_own_chat_history" ON public.chat_history;
DROP POLICY IF EXISTS "users_can_delete_own_chat_history" ON public.chat_history;

-- Create RLS policies for chat_history
CREATE POLICY "users_can_view_own_chat_history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_chat_history"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_chat_history"
  ON public.chat_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_chat_history"
  ON public.chat_history FOR DELETE
  USING (auth.uid() = user_id);
