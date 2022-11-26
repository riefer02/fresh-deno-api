import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../utils/prisma-client.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const res = await prisma.songs.findMany();

    return new Response(
      JSON.stringify({ message: "Here are all the songs", data: res })
    );
  },

  async POST(req, _ctx) {
    const { title } = await req.json();

    if (!title)
      return new Response(
        JSON.stringify({ message: "Please add a title for your song." })
      );

    const res = await prisma.songs.create({
      data: {
        title,
      },
    });

    return new Response(
      JSON.stringify({ message: "Song created successfully", data: res })
    );
  },
};
