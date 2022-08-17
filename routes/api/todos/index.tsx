/** @jsx h */
import { h } from "preact";

import { Handlers } from "$fresh/server.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import * as postgres from "https://deno.land/x/postgres@v0.16.1/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = config().DATABASE_URL;

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);

// Connect to the database
const connection = await pool.connect();

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const results = await connection.queryObject`
        SELECT * FROM public.todos
      `;
      const todos = results.rows;

      return new Response(JSON.stringify({ todos }), {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    } finally {
      connection.release();
    }
  },

  async POST(req, ctx) {
    try {
      const { title } = await req.json();

      if (!title)
        return new Response(
          JSON.stringify({
            message: "No title property found in request body",
          }),
          {
            status: 404,
          }
        );

      await connection.queryObject`
      INSERT INTO todos (title) VALUES (${title})
    `;

      return new Response(
        JSON.stringify({ message: "New todo added to database" }),
        { status: 201, statusText: "Todo Created" }
      );
    } catch (err) {
      return new Response(`${err.message}`, { status: 500 });
    } finally {
      connection.release();
    }
  },
};
