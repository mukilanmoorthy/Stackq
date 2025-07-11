import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rhkazcytrymrjptzxneq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoa2F6Y3l0cnltcmpwdHp4bmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjA5NzcsImV4cCI6MjA2NzY5Njk3N30.lMPwTfKQ20yYJMm0WGplMaN938h07DSJojIitMbXokE';

export const supabase = createClient(supabaseUrl, supabaseKey);
