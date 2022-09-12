import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    return new Response(JSON.stringify({ status: "Healthy" }), {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json" },
    });
  },
};
