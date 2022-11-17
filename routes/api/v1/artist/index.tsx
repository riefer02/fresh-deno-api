import { Handlers } from "$fresh/server.ts";
import dbPool from "../../../../utils/database-pool.ts";
import { errorHandler } from "../../../../utils/error-handlers.ts";
import { userData } from "../../../../utils/user-signal.ts";

// NPM Package in action!
import { PrismaClient } from "../../../../node_modules/.prisma/client/edge.js";

export const handler: Handlers = {
  async GET(req, _ctx) {
    try {
      await PrismaClient.create.artist({
        data: {
          name: `${req.method} ${req.url}`,
        },
      });

      return new Response(
        JSON.stringify({
          message: "Successfully created new artist w/ prisma client",
        })
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          message: "There was an error tring to use prisma client",
        }),
        { status: 500 }
      );
    }
  },

  async POST(req, _ctx) {
    const dbConn = await dbPool.connect();

    try {
      const user = userData.value;
      const { artistName } = await req.json();

      if (!artistName)
        return new Response(
          JSON.stringify({ message: "Please enter an artist name" }),
          { status: 400 }
        );

      const initialUserIdObject = JSON.stringify([
        { id: user.sub, email: user.email },
      ]);

      const results =
        await dbConn.queryObject`INSERT INTO public.artists (name, user_ids) VALUES (${artistName},
          ${initialUserIdObject}) RETURNING *;`;

      if (results.rows[0]) {
        return new Response(
          JSON.stringify({
            message: `Successfully created artxist.`,
          }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Testing at the moment. Hmmm... no results returned.",
        }),
        { status: 404 }
      );
    } catch (err) {
      err.message = errorHandler(err, "artist");

      return new Response(
        JSON.stringify({
          message: err.message,
        }),
        {
          status: 500,
          statusText: "Something went wrong",
        }
      );
    } finally {
      dbConn.release();
    }
  },
};
