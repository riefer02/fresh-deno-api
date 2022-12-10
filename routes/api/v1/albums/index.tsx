import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const res = await prisma.albums.findMany();

    return new Response(
      JSON.stringify({ message: "Here are all the albums", data: res })
    );
  },

  async POST(req, _ctx) {
    const { albumName } = await req.json();

    // Input Validation Functions TODO which returns clean API for handling missing fields and messenging
    if (!albumName)
      return new Response(
        JSON.stringify({
          message: "Please add missing fields for your album.",
        }),
        { status: 400 }
      );

    const res = await prisma.albums.create({
      data: {
        name: albumName,
      },
    });

    return new Response(
      JSON.stringify({ message: "Album created successfully", data: res })
    );
  },
};
