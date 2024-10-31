import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nyxjgsunzichdephvotf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eGpnc3VuemljaGRlcGh2b3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMTQwNzcsImV4cCI6MjA0NTg5MDA3N30.LeGgOhRH0JM_mqJpOlVj2xKREtm63JxOYODFU9BJK3o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
