/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { tw } from "@twind";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import dbPool from "../utils/database-pool.ts";
import cryptoKey from "../utils/crypto-key.ts";
import { getTomorrow } from "../utils/dates.ts";

const dbConn = await dbPool.connect();

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      let user;
      // Read Form Data TBD
      const { email, password } = await req.formData();

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
          )};`,
        },
      });
    } catch (err) {
      return ctx.render({ err });
    } finally {
      dbConn.release();
    }
  },
};

export default function Page({ data: err }) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <form method="post">
        <input type="email" name="email" class={tw`bg-gray-300 mr-4`} />
        <input type="password" name="password" class={tw`bg-gray-300 mr-4`} />
        <button type="submit">Login</button>
      </form>
      {err && <div>There was a problem during login {err.message}</div>}
    </div>
  );
}
