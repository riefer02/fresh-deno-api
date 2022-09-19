import { createClient } from "https://deno.land/x/supabase/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const supabaseURL = Deno.env.get("SUPABASE_URL")! || config().SUPABASE_URL;
const supabaseKey = Deno.env.get("DATABASE_KEY")! || config().DATABASE_KEY;

export const supabase = createClient(supabaseURL, supabaseKey);
