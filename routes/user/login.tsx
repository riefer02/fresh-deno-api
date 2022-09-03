/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import dbPool from "../../utils/database-pool.ts";
import { getTomorrow, jwtExpirationTime } from "../../utils/date-time.ts";

const dbConn = await dbPool.connect();

interface LoginCredentials {
  [key: string]: string | FormDataEntryValue;
  email: string;
  password: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      let user;
      const { email, password } = await req.formData().then((formData) => {
        const loginCredentials: LoginCredentials = { email: "", password: "" };
        for (const [key, value] of formData.entries()) {
          loginCredentials[key] = value;
        }
        return loginCredentials;
      });

      const results = await dbConn.queryObject`
              SELECT * FROM public.users WHERE email=${email}
            `;

      if (results.rows) {
        user = results.rows[0];
      }

      if (await bcrypt.compare(password, user.password)) {
        return new Response(
          JSON.stringify({
            message: "Passwords match",
          }),
          { status: 200 }
        );
      }

      // if (!user || !(await bcrypt.compare(password, user.password)) {
      //   new Response(
      //     JSON.stringify({ message: "Incorrect username and password" }),
      //     { status: 404 }
      //   );

      //   return ctx.render({
      //     err: new Error("Incorrect username and password"),
      //   });
      // }

      return new Response(
        JSON.stringify({
          message: "Searching for broken worker",
          email,
          password,
          results,
          user,
        }),
        { status: 200 }
      );

      const jwk = await Deno.readTextFile(".jwk");

      if (!jwk)
        new Response(JSON.stringify({ message: "jwk does not exist" }), {
          status: 500,
        });

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
        status: 303,
        statusText: "Successful login redirecting",
        headers: {
          ["set-cookie"]: `graveyardjs-jwt=${jwt}; SameSite=Lax; Expires=${new Date(
            getTomorrow()
          )}; Path=/; HttpOnly`,
          Location: "/user/profile",
        },
      });
    } catch (err) {
      return ctx.render({ err });
    } finally {
      dbConn.release();
    }
  },
};

export default function LoginPage(props: PageProps) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <form method="post">
        <input type="email" name="email" class={tw`bg-gray-300 mr-4`} />
        <input type="password" name="password" class={tw`bg-gray-300 mr-4`} />
        <button type="submit">Login</button>
      </form>
      {props.data?.err?.message.length > 0 && (
        <div>{props.data.err.message}</div>
      )}
    </div>
  );
}
