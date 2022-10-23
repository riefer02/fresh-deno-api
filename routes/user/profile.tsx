import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";
import { getUserProfile } from "../../services/user/get-user-profile.ts";

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
        {/* <div class="mb-10">
          <h3 class="font-bold mb-4">Add Artist/Project</h3>
          <form method="post" action="/api/v1/artist" class="flex flex-col">
            <label for="artist-name">Name</label>
            <input
              type="text"
              id="artist-name"
              name="artist-name"
              class="bg-gray-300 mb-4"
            />
            <label for="artist-genres">Genre</label>
            <select multiple name="artist-genres">
              <option>Rock</option>
              <option>Indie</option>
              <option>Hip Hop</option>
              <option>Eletronic</option>
              <option>Folk</option>
              <option>Country</option>
              <option>World</option>
            </select>
          </form>
        </div> */}

        {/* <div class="mt-10">
          <h3 class="font-bold">Artist Songs</h3>
          <label for="avatar">Upload a song to upload</label>
          <form
            method="post"
            encType="multipart/form-data"
            action="/api/v1/audio/song"
            class="flex flex-col"
          >
            <input
              type="file"
              id="song-file"
              name="song-file"
              accept="audio/mp3, audio/wav"
              class="mb-4"
            />
            <label for="song-name">Song Name</label>
            <input
              type="text"
              id="song-name"
              name="song-name"
              class="bg-gray-300 mb-4"
            />
            <label for="song-name">Song Description</label>

            <input
              type="text"
              id="song-description"
              name="song-description"
              class="bg-gray-300 mb-4"
            />
            <label for="song-name">Song Artist</label>

            <input
              type="text"
              id="song-artist"
              name="song-artist"
              class="bg-gray-300 mb-4"
            />
            <label for="song-name">Song Album</label>

            <input
              type="text"
              id="song-album"
              name="song-album"
              class="bg-gray-300 mb-4"
            />

            <button
              class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div> */}
      </div>
    </Layout>
  );
}
