import { config } from "https://deno.land/x/dotenv/mod.ts";

export const supabaseUrl =
  Deno.env.get("SUPABASE_URL") || config().SUPABASE_URL;

export const supabaseKey =
  Deno.env.get("SUPABASE_KEY") || config().SUPABASE_KEY;

export const supabaseAuthHeaders = {
  Authorization: `Bearer ${supabaseKey}`,
};
