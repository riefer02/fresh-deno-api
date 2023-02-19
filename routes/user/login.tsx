import { Handlers, PageProps } from "$fresh/server.ts";
import { compareSync } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import Layout from "../../components/Layout.tsx";
import { errorHandler } from "../../lib/error-handlers.ts";
import { getTomorrow } from "../../lib/date-time.ts";
import { createSessionToken } from "../../lib/jwt.ts";
import { LoginCredentials } from "../../lib/types.ts";
import { HeadElement } from "../../components/HeadElement.tsx";
import { eightHoursFromNow } from "../../lib/date-time.ts";
import prisma from "../../lib/prisma-client.ts";
import { inputStyles } from "../../lib/styles.ts";

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

      const jwt = await createSessionToken(user, eightHoursFromNow());

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
        <div class="mx-auto max-w-sm w-full py-10 p-8">
          <h1 class="py-6 text-4xl text-gray-900 text-center font-extrabold">
            Login Form
          </h1>
          <form method="post" class="flex flex-col">
            <input
              type="email"
              name="email"
              class={inputStyles}
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              class={inputStyles}
              placeholder="Password"
            />
            <button
              type="submit"
              class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
            >
              Login
            </button>
          </form>
          {props.data?.err?.message.length > 0 && (
            <div>{props.data.err.message}</div>
          )}
        </div>
      </Layout>
    </>
  );
}
