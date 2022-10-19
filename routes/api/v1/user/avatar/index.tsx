import { Handlers } from "$fresh/server.ts";
import {
  supabaseUrl,
  supabaseAuthHeaders,
} from "../../../../../utils/supabase-api.ts";
import dbPool from "../../../../../utils/database-pool.ts";
import { userData } from "../../../../../utils/user-signal.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const dbConn = await dbPool.connect();

    try {
      const user = userData.value;
      const form = await req.formData();
      const avatarFile = form.get("avatar");
      const url = `${supabaseUrl}/storage/v1/object/avatars/${user.email}-avatar`;

      let response = await fetch(url, {
        method: "POST",
        headers: supabaseAuthHeaders,
        body: avatarFile,
      });

      if (response.status === 400) {
        response = await fetch(url, {
          method: "PUT",
          headers: supabaseAuthHeaders,
          body: avatarFile,
        });
      }

      if (response.status === 200) {
        const { Key } = await response.json();

        const results =
          await dbConn.queryObject`UPDATE public.users SET avatar_url=${Key} WHERE email=${user.email} RETURNING *;`;

        if (results.rows[0]) {
          return new Response(
            JSON.stringify({ message: "Successfully uploaded user avatar" }),
            { status: 303, headers: { Location: "/user/profile" } }
          );
        }
      }

      return new Response(
        JSON.stringify({
          message: `${response.status} ${response.statusText}`,
        }),
        {
          status: response.status || 400,
          statusText: response.statusText || "Error",
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ message: `Failed to upload avatar: ${err.message}` }),
        {
          status: 500,
          statusText: "Error",
        }
      );
    } finally {
      dbConn.release();
    }
  },
};
