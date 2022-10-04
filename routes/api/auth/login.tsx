import { Handlers } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import dbPool from "../../../utils/database-pool.ts";
import { getTomorrow, jwtExpirationTime } from "../../../utils/date-time.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const dbConn = await dbPool.connect();

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

      const jwk = await Deno.readTextFile(".jwk");

      const reimportedKey = await crypto.subtle.importKey(
        "jwk",
        JSON.parse(jwk),
        { name: "HMAC", hash: "SHA-512" },
        true,
        ["sign", "verify"]
      );

      const jwt = await create(
        { alg: "HS512", typ: "JWT" },
        {
          sub: user.id,
          email: user.email,
          exp: jwtExpirationTime(),
          iss: "graveyardjs",
        },
        reimportedKey
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
