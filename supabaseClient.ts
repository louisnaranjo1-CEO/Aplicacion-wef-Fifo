import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kczgnxjubrmoucgvpvxf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjemdueGp1YnJtb3VjZ3ZwdnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTMxNzIsImV4cCI6MjA4MjUyOTE3Mn0.zSB8UbSdq5OJtmdsqGsOpx-uA4_atd6uJcIZ8VSpd50';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);