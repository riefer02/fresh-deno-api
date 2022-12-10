import { config } from "https://deno.land/x/dotenv/mod.ts";

const databaseUrl = Deno.env.get("DATABASE_URL")! || config().DATABASE_URL;

import { PrismaClient } from "@prisma/client/edge";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;
