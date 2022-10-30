import { Handlers } from "$fresh/server.ts";
import dbPool from "../../../../utils/database-pool.ts";
import { errorHandler } from "../../../../utils/error-handlers.ts";
import { userData } from "../../../../utils/user-signal.ts";

export const handler: Handlers = {
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
