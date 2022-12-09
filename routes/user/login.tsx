import { Handlers, PageProps } from "$fresh/server.ts";
import { compareSync } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import Layout from "../../components/Layout.tsx";
import { errorHandler } from "../../utils/error-handlers.ts";
import { getTomorrow } from "../../utils/date-time.ts";
import { createJWT } from "../../utils/jwt.ts";
import { LoginCredentials } from "../../utils/types.ts";
import { HeadElement } from "../../components/HeadElement.tsx";
import prisma from "../../utils/prisma-client.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    try {
      const { email, password } = await req.formData().then((formData) => {
        const loginCredentials: LoginCredentials = { email: "", password: "" };
        for (const [key, value] of formData.entries()) {
          loginCredentials[key] = value;
        }
        return loginCredentials;
      });

      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (!user || !(await compareSync(password, user.password))) {
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
      err.message = errorHandler(err, "user");
      return ctx.render({ err });
    }
  },
};

export default function LoginPage(props: PageProps) {
  return (
    <>
      <HeadElement
        title="Login Form"
        description="Login form to GraveyardJS"
        url={new URL(props.url.href)}
      />
      <Layout pathname={props.url.pathname}>
        <div class="p-4 mx-auto max-w-screen-md">
          <h1>Login Form</h1>
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
    </>
  );
}
