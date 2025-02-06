import { createClient } from '@supabase/supabase-js';
import { APP_NAME, SUPABASE_URL, SUPABASE_ANON_KEY } from '$lib/vars/client';

// Create a single supabase client for interacting with your database
export const supabaseCreateClient = (schema: string = 'public') => {
  const options = {
    db: { schema },
    headers: { 'x-app-name': APP_NAME },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  };
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
};

export const supabase = supabaseCreateClient();
