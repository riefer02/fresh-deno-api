
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { supabaseUrl, supabaseKey } from './supabase-api.ts'


// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)



