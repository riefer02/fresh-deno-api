import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import dbPool from "../../utils/database-pool.ts";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";

const dbConn = await dbPool.connect();
dbConn.release();

export const handler: Handlers = {
  async POST(req, ctx) {
    const filename = await req.formData().then((formData) => {
      for (const [key, value] of formData.entries()) {
        if (key === "avatar") return value;
      }
    });

    console.log({ filename });

    return new Response(JSON.stringify({ message: "Avatar uploading..." }), {
      status: 200,
      statusText: "OK",
    });
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
        <form method="post">
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
