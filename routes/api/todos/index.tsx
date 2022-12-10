import { Handlers } from "$fresh/server.ts";
import dbPool from "../../../lib/database-pool.ts";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const dbConn = await dbPool.connect();
    try {
      const results = await dbConn.queryObject`
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
      dbConn.release();
    }
  },

  async POST(req, _ctx) {
    const dbConn = await dbPool.connect();
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

      await dbConn.queryObject`
        INSERT INTO todos (title) VALUES (${title})
      `;

      return new Response(
        JSON.stringify({ message: "New todo added to database" }),
        { status: 201, statusText: "Todo Created" }
      );
    } catch (err) {
      return new Response(`${err.message}`, { status: 500 });
    } finally {
      dbConn.release();
    }
  },
};
