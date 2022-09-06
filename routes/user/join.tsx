/** @jsx h */
import { h, Fragment } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import {
  compareSync,
  genSalt,
  hash,
} from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import Layout from "../../components/Layout.tsx";
import dbPool from "../../utils/database-pool.ts";
import { getTomorrow, jwtExpirationTime } from "../../utils/date-time.ts";

interface LoginCredentials {
  [key: string]: string | FormDataEntryValue;
  email: string;
  password: string;
}

const dbConn = await dbPool.connect();

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

      if (!email || !password)
        return ctx.render({
          err: new Error("Email or password values are missing"),
        });

      const salt = await genSalt(8);
      const hashPassword = await hash(password, salt);

      const results = await dbConn.queryObject`
            INSERT INTO users(email,password,salt) VALUES (${email}, ${hashPassword}, ${salt})
          `;


      return new Response(JSON.stringify({ results }), { status: 200 });

      if (results.rows) {
        user = results.rows[0];
      }

      if (!user || !(await compareSync(password, user.password))) {
        new Response(
          JSON.stringify({ message: "Incorrect username and password" }),
          { status: 404 }
        );

        return ctx.render({
          err: new Error("Incorrect username and password"),
        });
      }

      const key = Deno.env.get("PRIVATE_KEY") || config().PRIVATE_KEY;

      if (!key)
        new Response(JSON.stringify({ message: "jwk does not exist" }), {
          status: 500,
        });

      const reimportedKey = await crypto.subtle.importKey(
        "jwk",
        JSON.parse(key),
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
      // Create Custom Error Handler for Postgres us `err.fields.code` value
      console.log(err.fields.code);

      return ctx.render({ err });
    } finally {
      dbConn.release();
    }
  },
};

export default function JoinPage(props: PageProps) {
  return (
    <Layout>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <h1>Join GraveyardJS Form</h1>
        <form method="post">
          <input type="email" name="email" class={tw`bg-gray-300 mr-4`} />
          <input type="password" name="password" class={tw`bg-gray-300 mr-4`} />
          <button type="submit">Create Account</button>
        </form>
        {props.data?.err?.message.length > 0 && (
          <Fragment>
            <div>{props.data.err.message}</div>
          </Fragment>
        )}
      </div>
    </Layout>
  );
}
