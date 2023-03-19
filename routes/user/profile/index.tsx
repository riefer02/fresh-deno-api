import { Handlers, PageProps } from "$fresh/server.ts";

import { isEmptyObject } from "../../../lib/is-empty-object.ts";
import { userData } from "../../../lib/user-signal.ts";
import { HOSTNAME } from "../../../lib/environment.ts";
import { getUserProfile } from "../../../lib/get-user-profile.ts";
import { inputStyles } from "../../../lib/styles.ts";

import Layout from "../../../components/Layout.tsx";
import { HeadElement } from "../../../components/HeadElement.tsx";

import CreateSongForm from "../../../islands/CreateSongForm.tsx";
import CreateAuthToken from "../../../islands/CreateAuthToken.tsx";
import UserAvatar from "../../../islands/UserAvatar.tsx";

interface UserJwt {
  sub: string;
  email: string;
  exp: number;
  iss: string;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const user: UserJwt = userData.value;

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
  const titleStyles = `text-2xl text-center gray-900 tracking-tight font-extrabold my-6`;

  return (
    <Layout pathname={props.url.pathname}>
      <HeadElement
        title={`User Profile ${userData.value.email}  | GraveyardJS`}
        description={`User profile of ${userData.value.email}.`}
        url={new URL(props.url.href)}
      />

      <div class="p-4 mx-auto max-w-md w-full">
        <div class="mb-10">
          {props.data?.user.email && (
            <p class={titleStyles}>{props.data.user.email || "Username"}</p>
          )}
          <div class="w-full flex items-center justify-center mb-4">
            <UserAvatar src={props?.data?.userAvatarUrl} />
          </div>
          <form
            method="post"
            encType="multipart/form-data"
            action="/api/v1/user/avatar"
            class="flex items-start justify-start gap-2"
          >
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              required
              class={inputStyles}
            />
            <button
              class="px-2 py-1 ml-auto rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
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
