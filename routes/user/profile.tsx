import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";
import { getUserProfile } from "../../services/user/get-user-profile.ts";
import CreateSongForm from "../../islands/CreateSongForm.tsx";
import { HOSTNAME } from "../../utils/environment.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const user = userData.value;

    if (isEmptyObject(user))
      return new Response(
        JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
        { status: 307, headers: { Location: "/user/login" } }
      );

    const { userAvatarUrl } = await getUserProfile(user);

    return ctx.render({ user, userAvatarUrl });
  },
};

export default function ProfilePage(props: PageProps) {
  const avatarFrameStyles = "w-20 h-20 rounded-full overflow-hidden";

  return (
    <Layout pathname={props.url.pathname}>
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="mb-10">
          {props.data?.user.email && (
            <p class="mb-6">
              Profile Page of {props.data.user.email || "poop"}
            </p>
          )}
          <div class={avatarFrameStyles}>
            {props.data?.userAvatarUrl ? (
              <img src={props.data.userAvatarUrl} alt="" class="object-cover" />
            ) : (
              <div class="h-full w-full bg-gray-300"></div>
            )}
          </div>
          <label for="avatar">Choose avatar to upload</label>
          <form
            method="post"
            encType="multipart/form-data"
            action="/api/v1/user/avatar"
          >
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
        <CreateSongForm apiURL={HOSTNAME} />
      </div>
    </Layout>
  );
}
