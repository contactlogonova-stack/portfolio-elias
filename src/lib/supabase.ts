import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const msg = 'Missing Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY). Please check your settings.'
  console.error(msg)
} else {
  console.log('Supabase client initialized with URL:', supabaseUrl.substring(0, 10) + '...')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
