import { supabaseUrl, supabaseAuthHeaders } from "../../lib/supabase-api.ts";

export const getUserAvatarImg = async (
  userAvatarKey: string,
  expiration: number
) => {
  try {
    const res = await fetch(
      `${supabaseUrl}/storage/v1/object/sign/${userAvatarKey}`,
      {
        method: "POST",
        headers: { ...supabaseAuthHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ expiresIn: expiration }),
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err.message));

    if (res.signedURL) {
      return `${supabaseUrl}/storage/v1${res.signedURL}`;
    }

    return "";
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: `There was a problem fetching the avatars presigned URL: ${err.message}`,
      }),
      { status: 500, statusText: "Server Error" }
    );
  }
};
