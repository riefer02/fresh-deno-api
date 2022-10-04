import { Handlers } from "$fresh/server.ts";
import { genSalt, hash } from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import dbPool from "../../../utils/database-pool.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const dbConn = await dbPool.connect();

    try {
      const { email, password } = await req.json();
      const salt = await genSalt(8);
      const hashPassword = await hash(password, salt);

      await dbConn.queryObject`
            INSERT INTO users(email,password,salt) VALUES (${email}, ${hashPassword}, ${salt})
          `;

      return new Response(JSON.stringify({ message: "New user registered" }), {
        status: 201,
        statusText: "OK",
      });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    } finally {
      dbConn.release();
    }
  },
};
