import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  POST(req, ctx) {
    return new Response(
      JSON.stringify({ message: "Song upload successfully..." })
    );
  },
};
