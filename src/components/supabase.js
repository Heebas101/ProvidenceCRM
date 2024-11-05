import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nacybxwvodjownjvzlnu.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
