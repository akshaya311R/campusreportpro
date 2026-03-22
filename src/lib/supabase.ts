import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqyftsrqbgxbworiiqbn.supabase.co';
const supabaseAnonKey = 'sb_publishable_R1s1EY_Fqnrvmto0JhCaVA_4oc8VaBT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
