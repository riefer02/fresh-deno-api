import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      // Return Readable Stream to Frontend
      console.log("Getting audio file");
      const currentDirectory = Deno.cwd();
      // const file = await Deno.readFile(`${currentDirectory}/static/audio.mp3`);

      // create subprocess: Covert Audio to Ogg format
      console.log("Coverting audio to ogg");
      console.log({ currentDirectory });

      const p = Deno.run({
        cmd: [
          "ffmpeg",
          "-i",
          `${currentDirectory}/static/audio.mp3`,
          "-c:a",
          "libvorbis",
          "-q:a",
          "5",
          `${currentDirectory}/static/audio.ogg`,
        ],
      });

      // await its completion
      await p.status();

      console.log("Opening new ogg file")
      const oggfile = await Deno.open(`${currentDirectory}/static/audio.ogg`, {
        read: true,
      });

      console.log("Creating readable stream");
      const readableStream = await oggfile.readable;

      console.log("Deleting file from server");
      await Deno.remove(`${currentDirectory}/static/audio.ogg`);

      console.log("Returning readable file stream to client");
      return new Response(readableStream, {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "audio/mpeg",
        },
      });

      // console.log({ file });

      // return new Response("Hello World", {
      //   status: 200,
      //   statusText: "OK",
      //   headers: {
      //     "Content-Type": "audio/mpeg",
      //   },
      // });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    }
  },
};
