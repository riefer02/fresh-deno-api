import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../../components/Layout.tsx";
import { HeadElement } from "../../../components/HeadElement.tsx";
import AudioPlayer from "../../../islands/AudioPlayer.tsx";
import { HOSTNAME } from "../../../lib/environment.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  POST(_req, ctx) {
    return ctx.render();
  },
};

export default function ChatPage(props: PageProps) {
  return (
    <>
      <HeadElement
        title="Ogg Conversion"
        description="The Terlingua Cowboy Chatbot, an interal tool for graveyardjs, is an AI overlord who runs this domain. He stands before you ready to serve. Best to keep your wits about you."
        url={new URL(props.url.href)}
      />
      <Layout pathname={props.url.pathname}>
        <div class="min-h-[70vh]">
          <div class="mx-auto max-w-screen-md py-10 p-8 text-center">
            <h1 class="text-6xl font-bold py-4 px-6 text-gray-900">Ogg Conversion</h1>
            <div class="mb-10 py-4 px-6 text-gray-900">
              <p class="mb-2">
                This is a prototype for file format manipulation for optimial
                storage and performance of audio files to end users.
              </p>
              <p>
                Requires running a subprocess and accessing ffmpeg, but Deno
                Deploy doesn't currently allow for usage of subprocesses on
                their platform. Currently exploring containerized deployment
                through other platforms.
              </p>
            </div>
            <AudioPlayer apiURL={HOSTNAME} />
            {props.data?.err?.message.length > 0 && (
              <div>{props.data.err.message}</div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
