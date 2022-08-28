import { config } from "https://deno.land/x/dotenv/mod.ts";
import * as postgres from "https://deno.land/x/postgres@v0.16.1/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL")! || config().DATABASE_URL;

// Create a database pool with three connections that are lazily established
const dbPool = new postgres.Pool(databaseUrl, 4, true);

export default dbPool;
