import { Handlers } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import dbPool from "../../../utils/database-pool.ts";
import cryptoKey from "../../../utils/crypto-key.ts";
import { getTomorrow } from "../../../utils/date-time.ts";

const dbConn = await dbPool.connect();

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      let user;

      const { email, password } = await req.json();

      const results = await dbConn.queryObject`
              SELECT * FROM users WHERE email=${email}
            `;

      if (results.rows) {
        user = results.rows[0];
      }

      if (!user || !(await bcrypt.compare(password, user.password)))
        new Response(
          JSON.stringify({ message: "Incorrect username and password" }),
          { status: 400 }
        );

      const jwt = await create(
        { alg: "HS512", typ: "JWT" },
        { id: user.id },
        cryptoKey
      );

      return new Response(JSON.stringify({ message: "Successful login" }), {
        status: 200,
        statusText: "OK",
        headers: {
          ["set-cookie"]: `graveyardjs-jwt=${jwt}; Expires=${new Date(
            getTomorrow()
          )}; SameSite=Lax`,
        },
      });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    } finally {
      dbConn.release();
    }
  },
};
