import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const currentDirectory = Deno.cwd();

    const file = await Deno.open(`${currentDirectory}/static/audio.mp3`, {
      read: true,
    });

    const readableStream = await file.readable;

    try {
      return new Response(readableStream, {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "audio/mpeg",
        },
      });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    }
  },
};
