import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL 또는 Anon Key가 설정되지 않았습니다.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
