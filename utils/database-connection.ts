import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import * as postgres from "https://deno.land/x/postgres@v0.16.1/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = config().DATABASE_URL || Deno.env.get("DATABASE_URL");

// Create a database pool with three connections that are lazily established
const dbPool = new postgres.Pool(databaseUrl, 3, true);

// Connect to the database
const dbConn = await dbPool.connect();

export default dbConn;
