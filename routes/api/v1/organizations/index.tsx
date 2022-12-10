
import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
    async GET(_req, _ctx) {
      const res = await prisma.organizations.findMany();
  
      return new Response(
        JSON.stringify({ message: "Here are all the organizations", data: res })
      );
    },
  
    async POST(req, _ctx) {
      const { organizationName } = await req.json();
  
      // Input Validation Functions TODO which returns clean API for handling missing fields and messenging
      if (!organizationName)
        return new Response(
          JSON.stringify({ message: "Please add missing fields for your song." }),
          { status: 400 }
        );
  
      const res = await prisma.organizations.create({
        data: {
          name: organizationName,
        },
      });
  
      return new Response(
        JSON.stringify({ message: "Song created successfully", data: res })
      );
    },
  };