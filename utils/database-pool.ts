import { config } from "https://deno.land/x/dotenv/mod.ts";
import * as postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("MIGRATION_DATABASE_URL")! || config().MIGRATION_DATABASE_URL;
// Create a database pool with twelve connections that are lazily established
const dbPool = new postgres.Pool(databaseUrl, 12, true);

export default dbPool;
