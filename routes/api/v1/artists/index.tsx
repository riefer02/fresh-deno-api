import { Handlers } from "$fresh/server.ts";
import dbPool from "../../../../utils/database-pool.ts";
import { errorHandler } from "../../../../utils/error-handlers.ts";
import { userData } from "../../../../utils/user-signal.ts";

import { PrismaClient } from "@prisma/client/edge";
const prisma = new PrismaClient();

interface UserData {
  sub?: string;
  email?: string;
}

export const handler: Handlers = {
  async GET(req, _ctx) {
    console.log('here')
    try {
      const artist = await prisma.artists.create({
        data: {
          name: `Prisma Artist v5`,
        },
      });

      const body = JSON.stringify(artist, null, 2);

      return new Response(body, {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          message: "There was an error trying to use prisma client",
        }),
        { status: 500 }
      );
    }
  },

  async POST(req, _ctx) {
    const dbConn = await dbPool.connect();

    try {
      const user: UserData = userData.value;
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
