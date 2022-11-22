import { Handlers } from "$fresh/server.ts";

import { PrismaClient } from "@prisma/client/edge";
const prisma = new PrismaClient();

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const res = await prisma.songs.findMany();

    return new Response(
      JSON.stringify({ message: "Here are all the songs", data: res })
    );
  },
  async POST(_req, _ctx) {
    const res = await prisma.songs.create({
      data: {
        title: "Freebird 2",
      },
    });

    return new Response(
      JSON.stringify({ message: "Song upload successfully...", data: res })
    );
  },
};
