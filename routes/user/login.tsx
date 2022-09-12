import { Handlers, PageProps } from "$fresh/server.ts";
import { compareSync } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import Layout from "../../components/Layout.tsx";
import dbPool from "../../utils/database-pool.ts";
import { errorHandler } from "../../utils/error-handlers.ts";
import { getTomorrow } from "../../utils/date-time.ts";
import { createJWT } from "../../utils/jwt.ts";

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

      const results = await dbConn.queryObject`
              SELECT * FROM public.users WHERE email=${email}
            `;

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

      const jwt = await createJWT(user);

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
      err.message = errorHandler(err);

      return ctx.render({ err });
    } finally {
      dbConn.release();
    }
  },
};

export default function LoginPage(props: PageProps) {
  return (
    <Layout>
      <div class="p-4 mx-auto max-w-screen-md">
        <form method="post">
          <input type="email" name="email" class="bg-gray-300 mr-4" />
          <input type="password" name="password" class="bg-gray-300 mr-4" />
          <button type="submit">Login</button>
        </form>
        {props.data?.err?.message.length > 0 && (
          <div>{props.data.err.message}</div>
        )}
      </div>
    </Layout>
  );
}
