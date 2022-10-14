import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";
import dbPool from "../../utils/database-pool.ts";
import {
  supabaseUrl,
  supabaseAuthHeaders,
  getUserAvatarImg,
} from "../../utils/supabase-api.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const dbConn = await dbPool.connect();

    try {
      const user = userData.value;
      const form = await req.formData();
      const avatarFile = form.get("avatar");
      const url = `${supabaseUrl}/storage/v1/object/avatars/${user.email}-avatar`;

      const response = await fetch(url, {
        method: "POST",
        headers: supabaseAuthHeaders,
        body: avatarFile,
      });

      if (response.status === 200) {
        const { Key } = await response.json();

        const results =
          await dbConn.queryObject`UPDATE public.users SET avatar_url=${Key} WHERE email=${user.email} RETURNING *;`;

        if (results.rows[0]) {
          return ctx.render({ user: userData.value });
        }

        throw new Error("No row was returned when updating user data.");
      }

      return new Response(
        JSON.stringify({
          message: "Something went wrong when updating user data.",
        }),
        {
          status: 400,
          statusText: "Error",
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
  async GET(_req, ctx) {
    const user = userData.value;

    if (isEmptyObject(user))
      return new Response(
        JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
        { status: 307, headers: { Location: "/user/login" } }
      );

    const dbConn = await dbPool.connect();

    try {
      let userAvatarKey, userAvatarUrl;

      const results =
        await dbConn.queryObject`SELECT (avatar_url) FROM public.users WHERE email = ${user.email};`;

      if (results.rows[0]) {
        userAvatarKey = results.rows[0]?.avatar_url;
      }

      if (userAvatarKey) userAvatarUrl = await getUserAvatarImg(userAvatarKey);

      return ctx.render({ user, userAvatarUrl });
    } catch (err) {
      return new Response(
        JSON.stringify({
          message: `Something went wrong finding your profile. Error: ${err.message}`,
        }),
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

export default function ProfilePage(props: PageProps) {
  const avatarFrameStyles = "w-20 h-20 rounded-full overflow-hidden";

  return (
    <Layout pathname={props.url.pathname}>
      <div class="p-4 mx-auto max-w-screen-md">
        {props.data?.user.email && (
          <p class="mb-6">Profile Page of {props.data.user.email || "poop"}</p>
        )}
        <div class={avatarFrameStyles}>
          {props.data?.userAvatarUrl ? (
            <img
              src={props.data.userAvatarUrl}
              alt=""
              class="object-cover"
            />
          ) : (
            <div class="h-full w-full bg-gray-300"></div>
          )}
        </div>
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
