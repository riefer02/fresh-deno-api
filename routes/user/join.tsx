import { Handlers, PageProps } from "$fresh/server.ts";
import { genSalt, hash } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import Layout from "../../components/Layout.tsx";
import dbPool from "../../utils/database-pool.ts";
import { getTomorrow } from "../../utils/date-time.ts";
import { errorHandler } from "../../utils/error-handlers.ts";

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
            INSERT INTO users(email,password,salt) VALUES (${email}, ${hashPassword}, ${salt}) RETURNING *;
          `;

      console.log("results", results);

      return;

      if (results.rowCount > 0) {
        const jwt = await createJWT(user);

        return new Response(JSON.stringify({ message: "Successful sign up" }), {
          status: 303,
          statusText: "Successful sign up redirecting",
          headers: {
            ["set-cookie"]: `graveyardjs-jwt=${jwt}; SameSite=Lax; Expires=${new Date(
              getTomorrow()
            )}; Path=/; HttpOnly`,
            Location: "/user/profile",
          },
        });
      }
    } catch (err) {
      console.log("Error", err);
      err.message = errorHandler(err);

      return ctx.render({ err });
    } finally {
      dbConn.release();
    }
  },
};

export default function JoinPage(props: PageProps) {
  return (
    <Layout pathname={props.url.pathname}>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1>Join GraveyardJS Form</h1>
        <form method="post">
          <input type="email" name="email" class="bg-gray-300 mr-4" />
          <input type="password" name="password" class="bg-gray-300 mr-4" />
          <button type="submit">Create Account</button>
        </form>
        {props.data?.err?.message.length > 0 && (
          <>
            <div>{props.data.err.message}</div>
          </>
        )}
      </div>
    </Layout>
  );
}
