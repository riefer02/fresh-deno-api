import { Handlers } from "$fresh/server.ts";
import dbPool from "../../../../utils/database-pool.ts";
import { errorHandler } from "../../../../utils/error-handlers.ts";
import { userData } from "../../../../utils/user-signal.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    console.log({ req, ctx });
    const dbConn = await dbPool.connect();

    try {
      const user = userData.value;
      const form = await req.formData();
      const artistName = form.get("artist-name");
      const initialUserIdObject = JSON.stringify([
        { id: user.sub, email: user.email },
      ]);

      const results =
        await dbConn.queryObject`INSERT INTO public.artists (name, user_ids) VALUES (${artistName}, 
          ${initialUserIdObject}) RETURNING *;`;

      if (results.rows[0]) {
        return new Response(
          JSON.stringify({
            message: `Successfully created artist. ${results.rows[0]}`,
          }),
          { status: 303, headers: { Location: "/user/profile" } }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Testing at the moment. Hmmm... no results returned.",
        })
      );
    } catch (err) {
      err.message = errorHandler(err, "artist");

      return new Response(
        JSON.stringify({
          message: err.message,
        }),
        {
          status: 303,
          statusText: "Something went wrong",
          headers: { Location: "/user/profile", error: err.message },
        }
      );
    } finally {
      dbConn.release();
    }
  },
};
