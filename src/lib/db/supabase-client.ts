import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://douxqebnfvrbhmfqexin.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_-JRu7Tuuc2ENUGEqZS0vfw_AO2R1-A8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
