import { Handlers } from "$fresh/server.ts";

import { PrismaClient } from "@prisma/client/edge";
const prisma = new PrismaClient();

export const handler: Handlers = {
  async POST(req, ctx) {
    const res = await prisma.songs.create({
      data: {
        title: "Freebird",
      },
    });

    return new Response(
      JSON.stringify({ message: "Song upload successfully...", data: res })
    );
  },
};
