import { Handlers } from "$fresh/server.ts";
import { iterateReader } from "https://deno.land/std@0.187.0/streams/iterate_reader.ts";
import { readableStreamFromIterable } from "https://deno.land/std@0.172.0/streams/readable_stream_from_iterable.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const currentDirectory = Deno.cwd();
      const command = new Deno.Command("ffmpeg", {
        args: [
          "-i",
          `${currentDirectory}/static/audio/audio.mp3`,
          "-c:a",
          "libvorbis",
          "-q:a",
          "5",
          `${currentDirectory}/static/audio/audio.ogg`,
        ],
      });
      const { code, stdout, stderr } = await command.output();
      console.log({ code, stdout, stderr });

      const oggFile = await Deno.open(
        `${currentDirectory}/static/audio/audio.ogg`,
        {
          read: true,
        }
      );

      const fileInfo = await Deno.stat(
        `${currentDirectory}/static/audio/audio.ogg`
      );
      console.log("File type:", fileInfo.isFile);

      console.log("Creating readable stream");
      const reader = iterateReader(oggFile);
      const stream = readableStreamFromIterable(reader);

      console.log("Returning readable file stream to client");
      const headers = new Headers();
      headers.set("Content-Type", "audio/ogg");
      headers.set("Cache-Control", "no-cache");
      headers.set("Connection", "keep-alive");
      headers.set("Content-Disposition", "inline");

      const response = new Response(stream, {
        status: 200,
        statusText: "OK",
        headers,
      });

      // console.log("Waiting for the reader to finish...");
      // for await (const _ of reader) {
      // }

      console.log("Deleting file from server");
      await Deno.remove(`${currentDirectory}/static/audio/audio.ogg`);

      return response;
    } catch (err) {
      console.error(err);
      return new Response(`${err.message}`, { status: 500 });
    }
  },
};
