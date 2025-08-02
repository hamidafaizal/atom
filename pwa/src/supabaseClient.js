import { createClient } from '@supabase/supabase-js';

// supabaseClient.js: Inisialisasi dan ekspor client Supabase untuk PWA
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL (PWA):', supabaseUrl ? 'Loaded' : 'Not Loaded'); // log untuk debugging
console.log('Supabase Anon Key (PWA):', supabaseAnonKey ? 'Loaded' : 'Not Loaded'); // log untuk debugging

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
