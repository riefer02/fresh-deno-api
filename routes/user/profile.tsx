import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";
import { supabase } from "../../utils/supabase-client.ts";
import { toFileUrl, resolve } from "https://deno.land/std/path/mod.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const form = await req.formData();
      const avatarFile = form.get("avatar");

      // const { data, error } = await supabase.storage
      //   .from("avatars")
      //   .upload(avatarFileUrl, avatarFile);

      // console.log({ data });

      return new Response(JSON.stringify({ message: "Avatar uploading..." }), {
        status: 200,
        statusText: "OK",
      });
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
        <p class="mb-6">Profile Page of {props.data.user.email}</p>
        <label for="avatar">Choose avatar to upload</label>
        <form method="post" encType="multipart/form-data" webkitdirectory>
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
