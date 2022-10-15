import { Handlers } from "$fresh/server.ts";
export const handler: Handlers = {
  GET(req, ctx) {
    return new Response(JSON.stringify({ message: "Hello Avatar" }));
  },
};
