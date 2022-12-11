import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const { id } = ctx.params;
      const res = await prisma.songs.findFirst({
        where: {
          song_id: id,
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
          song_id: id,
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

  async PATCH(req, ctx) {
    const { id } = ctx.params;
    const { title } = await req.json();

    try {
      const updateSong = await prisma.songs.update({
        where: {
          song_id: id,
        },
        data: {
          title,
        },
      });

      return new Response(
        JSON.stringify({
          data: updateSong,
          message: "Successfully updated the song",
        }),
        {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    }
  },
};
