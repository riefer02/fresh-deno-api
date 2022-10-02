import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";
import dbPool from "../../utils/database-pool.ts";
import { supabaseUrl, supabaseAuthHeaders } from "../../utils/supabase-api.js";

export const handler: Handlers = {
  async POST(req, ctx) {
    const dbConn = await dbPool.connect();

    try {
      const form = await req.formData();
      const avatarFile = form.get("avatar");
      const url = `${supabaseUrl}/storage/v1/object/avatars/${avatarFile.name}`;

      const response = await fetch(url, {
        method: "POST",
        headers: supabaseAuthHeaders,
        body: avatarFile,
      });

      // console.log(response);

      // if (response.status === 200) {
      //     const results = await dbConn.queryObject`
      //     INSERT INTO public.users(avatar_url) VALUES (${"blah"}) RETURNING *;
      //   `;

      //     console.log(results);
      //   return ctx.render({ user: userData.value });
      // }

      return new Response(
        JSON.stringify({ message: "Something went wrong or did it?" }),
        {
          status: 400,
          statusText: "OK",
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
  GET(_req, ctx) {
    const user = userData.value;

    if (isEmptyObject(user))
      return new Response(
        JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
        { status: 307, headers: { Location: "/user/login" } }
      );

    return ctx.render({ user });
  },
};

export default function ProfilePage(props: PageProps) {
  return (
    <Layout pathname={props.url.pathname}>
      <div class="p-4 mx-auto max-w-screen-md">
        {props.data?.user.email && (
          <p class="mb-6">Profile Page of {props.data.user.email || "poop"}</p>
        )}
        <label for="avatar">Choose avatar to upload</label>
        <form method="post" encType="multipart/form-data">
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
          />
          <button
            class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}
