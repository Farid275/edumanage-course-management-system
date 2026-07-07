import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate the URL format to prevent new URL() TypeError crashes
let supabaseUrl = 'https://placeholder-project.supabase.co'
let supabaseAnonKey = 'placeholder-anon-key'

try {
  if (envUrl && envUrl.startsWith('http')) {
    new URL(envUrl);
    supabaseUrl = envUrl;
  }
} catch (e) {
  console.warn("Invalid VITE_SUPABASE_URL in .env");
}

if (envKey && envKey !== 'YOUR_SUPABASE_ANON_KEY_HERE') {
  supabaseAnonKey = envKey;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
