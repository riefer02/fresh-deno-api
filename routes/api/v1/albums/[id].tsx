import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const { id } = ctx.params;
      const res = await prisma.albums.findUnique({
        where: {
          album_id: id,
        },
      });

      return new Response(
        JSON.stringify({
          message: `Here is the album name by id: ${res.name}`,
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
      const res = await prisma.albums.delete({
        where: {
          album_id: id,
        },
      });

      return new Response(
        JSON.stringify({
          message: `Here is the album by id that was deleted: ${res.name}`,
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
    const { albumName } = await req.json();

    try {
      const updateAlbum = await prisma.albums.update({
        where: {
          album_id: id,
        },
        data: {
          name: albumName,
        },
      });

      return new Response(
        JSON.stringify({
          data: updateAlbum,
          message: "Successfully updated the album",
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
