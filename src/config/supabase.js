import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qumggiovbwzuvcjinvzo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bWdnaW92Ynd6dXZjamludnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTgyMjYsImV4cCI6MjA1OTYzNDIyNn0.yhepBMqBsDfOf1hg1ZMOTTYNIkrqP1a0qsGOlIBPvCQ'

export const supabase = createClient(supabaseUrl, supabaseKey) 