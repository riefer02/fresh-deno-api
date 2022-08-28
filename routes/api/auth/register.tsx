import { Handlers } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import dbPool from "../../../utils/database-pool.ts";

const dbConn = await dbPool.connect();

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const { email, password } = await req.json();
      const salt = await bcrypt.genSalt(8);
      const hashPassword = await bcrypt.hash(password, salt);

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
