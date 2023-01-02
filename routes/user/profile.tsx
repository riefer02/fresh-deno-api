import { Handlers, PageProps } from "$fresh/server.ts";

import { isEmptyObject } from "../../lib/is-empty-object.ts";
import { userData } from "../../lib/user-signal.ts";
import { HOSTNAME } from "../../lib/environment.ts";

import { getUserProfile } from "../../services/user/get-user-profile.ts";

import Layout from "../../components/Layout.tsx";
import { HeadElement } from "../../components/HeadElement.tsx";

import CreateSongForm from "../../islands/CreateSongForm.tsx";
import CreateAuthToken from "../../islands/CreateAuthToken.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const user = userData.value;

    if (isEmptyObject(user))
      return new Response(
        JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
        { status: 307, headers: { Location: "/user/login" } }
      );

    const { userAvatarUrl, tokenExists } = await getUserProfile(user);

    return ctx.render({ user, userAvatarUrl, tokenExists });
  },
};

export default function ProfilePage(props: PageProps) {
  const avatarFrameStyles = "w-20 h-20 rounded-full overflow-hidden";

  return (
    <Layout pathname={props.url.pathname}>
      <HeadElement
        title={`${userData.value.email} User Profile | GraveyardJS`}
        description={`User profile of ${userData.value.email}.`}
        url={new URL(props.url.href)}
      />
      <div class="p-4 mx-auto max-w-md w-full">
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
              required
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
        <CreateAuthToken
          apiURL={HOSTNAME}
          tokenExists={props.data?.tokenExists}
          user={props.data?.user}
        />
      </div>
    </Layout>
  );
}
