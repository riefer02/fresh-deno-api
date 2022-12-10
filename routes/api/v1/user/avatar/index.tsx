import { Handlers } from "$fresh/server.ts";
import {
  supabaseUrl,
  supabaseAuthHeaders,
} from "../../../../../lib/supabase-api.ts";
import { userData } from "../../../../../lib/user-signal.ts";
import prisma from "../../../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
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

        const updateUser = await prisma.users.update({
          where: {
            email: user.email,
          },
          data: {
            avatar_url: Key,
          },
        });

        if (updateUser) {
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
    }
  },
};
