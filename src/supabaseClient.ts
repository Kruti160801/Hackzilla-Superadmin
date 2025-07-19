import { createClient } from '@supabase/supabase-js';

// Use the correct env variable names as in .env
const supabaseUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY as string;

// Optional: Add a runtime check for missing env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be provided as environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
