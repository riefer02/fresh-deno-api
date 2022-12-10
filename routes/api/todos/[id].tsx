import { Handlers } from "$fresh/server.ts";
import dbPool from "../../../lib/database-pool.ts";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    const dbConn = await dbPool.connect();

    try {
      const results = await dbConn.queryObject`
        SELECT * FROM public.todos WHERE id=${id}
      `;
      const todo = results.rows;

      return new Response(JSON.stringify({ todo }), {
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

  async DELETE(req, ctx) {
    const { id } = ctx.params;
    const dbConn = await dbPool.connect();

    try {
      const results = await dbConn.queryObject`
              DELETE  FROM public.todos WHERE id=${id}
            `;

      if (results.rowCount === 0) {
        return new Response(
          JSON.stringify({ message: "Todo does not exist" }),
          {
            status: 404,
            statusText: "Not Found",
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ message: "Successfully deleted todo", results }),
        {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      return new Response(`${err.name}: ${err.message} because ${err.cause}`, {
        status: err.statusCode ? err.statusCode : 500,
        statusText: "Error",
      });
    } finally {
      dbConn.release();
    }
  },

  async PATCH(req, ctx) {
    const dbConn = await dbPool.connect();
    const { id } = ctx.params;
    const { title } = await req.json();

    try {
      const results = await dbConn.queryObject`
        UPDATE public.todos SET title=${title} WHERE id=${id} RETURNING *
      `;

      if (results.rowCount === 0) {
        return new Response(
          JSON.stringify({ message: "Todo does not exist" }),
          {
            status: 404,
            statusText: "Not Found",
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const todo = results.rows;

      return new Response(JSON.stringify({ todo }), {
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
};
