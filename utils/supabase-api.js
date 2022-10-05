import { config } from "https://deno.land/x/dotenv/mod.ts";

export const supabaseUrl =
  Deno.env.get("SUPABASE_URL") || config().SUPABASE_URL;

export const supabaseKey =
  Deno.env.get("SUPABASE_KEY") || config().SUPABASE_KEY;

export const supabaseAuthHeaders = {
  Authorization: `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
};

export const getUserAvatarImg = async (userAvatarKey) => {
  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/sign/${userAvatarKey}`,
    {
      method: "POST",
      headers: supabaseAuthHeaders,
      body: JSON.stringify({ expiresIn: 6000 }),
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err.message));

  return `${supabaseUrl}/storage/v1${res.signedURL}`;
};
