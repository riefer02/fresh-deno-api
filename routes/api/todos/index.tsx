/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
// import dbConn from "../../../utils/database-connection.ts";

import { config } from "https://deno.land/x/dotenv/mod.ts";
import * as postgres from "https://deno.land/x/postgres@v0.16.1/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL")! || config().DATABASE_URL;

// Create a database pool with three connections that are lazily established
const dbPool = new postgres.Pool(databaseUrl, 3, true);

// Connect to the database
const dbConn = await dbPool.connect();

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const results = await dbConn.queryObject`
        SELECT * FROM public.todos
      `;
      const todos = results.rows;

      BigInt.prototype.toJSON = function () {
        return this.toString();
      };

      return new Response(JSON.stringify({ todos }), {
        // return new Response(JSON.stringify("hello world"), {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    } finally {
      dbConn.release();
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

      //   await dbConn.queryObject`
      //   INSERT INTO todos (title) VALUES (${title})
      // `;

      return new Response(
        JSON.stringify({ message: "New todo added to database" }),
        { status: 201, statusText: "Todo Created" }
      );
    } catch (err) {
      return new Response(`${err.message}`, { status: 500 });
    } finally {
      // dbConn.release();
    }
  },
};
