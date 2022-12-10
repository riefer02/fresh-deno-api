import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const res = await prisma.artists.findMany();

    return new Response(
      JSON.stringify({ message: "Here are all the artists", data: res })
    );
  },

  async POST(req, _ctx) {
    const { artistName } = await req.json();

    // Input Validation Functions TODO which returns clean API for handling missing fields and messenging
    if (!artistName)
      return new Response(
        JSON.stringify({ message: "Please add missing fields for your artist." }),
        { status: 400 }
      );

    const res = await prisma.artists.create({
      data: {
        name: artistName,
      },
    });

    return new Response(
      JSON.stringify({ message: "Artist created successfully", data: res })
    );
  },
};
