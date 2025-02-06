import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$lib/vars/client';

// Create a single supabase client for interacting with your database
export const supabaseCreateClient = (schema: string = 'public') =>
	createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { db: { schema } });

export const supabase = supabaseCreateClient();
