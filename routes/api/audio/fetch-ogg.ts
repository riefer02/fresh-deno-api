import { Handlers } from "$fresh/server.ts";


export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      console.log("Getting audio file");
      const currentDirectory = Deno.cwd();
      const oggFile = await Deno.readFileSync(`${currentDirectory}/static/audio/audio.ogg`);

      console.log("Returning file to client");
      const headers = new Headers();
      headers.set("Content-Type", "audio/ogg");
      headers.set("Cache-Control", "no-cache");
      headers.set("Connection", "keep-alive");
      headers.set("Content-Disposition", "inline");

      return new Response(oggFile, {
        status: 200,
        statusText: "OK",
        headers,
      });
    } catch (err) {
      console.error(err);
      return new Response(`${err.message}`, { status: 500 });
    }
  },
};
