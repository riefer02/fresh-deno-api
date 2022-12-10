import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const { id } = ctx.params;
      const res = await prisma.artists.findUnique({
        where: {
          artist_id: id,
        },
      });

      return new Response(
        JSON.stringify({
          message: `Here is the artist name by id: ${res.name}`,
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
      const res = await prisma.artists.delete({
        where: {
          artist_id: id,
        },
      });

      return new Response(
        JSON.stringify({
          message: `Here is the artist by id that was deleted: ${res.name}`,
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
    const { artistName } = await req.json();

    try {
      const updateArtist = await prisma.artists.update({
        where: {
          artist_id: id,
        },
        data: {
          name: artistName,
        },
      });

      return new Response(
        JSON.stringify({
          data: updateArtist,
          message: "Successfully updated the artist",
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
