import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../utils/prisma-client.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const { id } = ctx.params;
      const res = await prisma.songs.findUnique({
        where: {
          id,
        },
      });

      return new Response(
        JSON.stringify({
          message: `Here is the song by id: ${res.title}`,
          data: res,
        })
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          message: `There was a problem executing ${req.url} requests`,
        }),
        { status: 500 }
      );
    }
  },

  async DELETE(req, ctx) {
    try {
      const { id } = ctx.params;
      const res = await prisma.songs.delete({
        where: {
          id,
        },
      });

      return new Response(
        JSON.stringify({
          message: `Here is the song by id that was deleted: ${res.title}`,
          data: res,
        })
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          message: `There was a problem executing ${req.url} requests. Error: ${err.message}`,
        }),
        { status: 500 }
      );
    }
  },

  //   async PATCH(req, ctx) {

  //   },
};
