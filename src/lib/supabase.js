import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ktrqhmzaesllajbowymt.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cnFobXphZXNsbGFqYm93eW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDAxMzMsImV4cCI6MjEwMzQxNjEzM30.SvwTDEBlfJ8hfyC2ELCCskXk2uVNGpDB73VLHJDHAVg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
