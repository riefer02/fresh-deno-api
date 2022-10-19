import { config } from "https://deno.land/x/dotenv/mod.ts";

export const supabaseUrl =
  Deno.env.get("SUPABASE_URL") || config().SUPABASE_URL;

export const supabaseKey =
  Deno.env.get("SUPABASE_KEY") || config().SUPABASE_KEY;

export const supabaseAuthHeaders = {
  Authorization: `Bearer ${supabaseKey}`,
};

export const getUserAvatarImg = async (userAvatarKey: string) => {
  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/sign/${userAvatarKey}`,
    {
      method: "POST",
      headers: { ...supabaseAuthHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 6000 }),
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err.message));

  if (res.signedURL) {
    return `${supabaseUrl}/storage/v1${res.signedURL}`;
  }

  return "";
};
