import { config } from "https://deno.land/x/dotenv/mod.ts";

export const DENO_ENV = Deno.env.get("DENO_ENV") || config().DENO_ENV;
export const PORT = Deno.env.get("PORT") || config().PORT;

export const HOSTNAME =
  DENO_ENV !== "development"
    ? Deno.env.get("HOSTNAME") || config().HOSTNAME
    : `http://localhost:${PORT}/`;
