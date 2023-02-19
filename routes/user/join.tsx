import { Handlers, PageProps } from "$fresh/server.ts";
import { genSalt, hash } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import Layout from "../../components/Layout.tsx";
import { getTomorrow } from "../../lib/date-time.ts";
import { errorHandler } from "../../lib/error-handlers.ts";
import { createSessionToken } from "../../lib/jwt.ts";
import { LoginCredentials } from "../../lib/types.ts";
import { HeadElement } from "../../components/HeadElement.tsx";
import { eightHoursFromNow } from "../../lib/date-time.ts";
import prisma from "../../lib/prisma-client.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
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

      const user = await prisma.users.create({
        data: {
          email,
          password: hashPassword,
          salt,
        },
      });

      if (user) {
        const jwt = await createSessionToken(user, eightHoursFromNow());

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

      return new Response(
        JSON.stringify({ message: "Unable to create new user" })
      );
    } catch (err) {
      err.message = errorHandler(err, "user");
      return ctx.render({ err });
    }
  },
};

export default function JoinPage(props: PageProps) {
  const inputStyles = `rounded-lg mb-4 py-1 px-2 bg-gray-100 border-purple-200 border`;

  return (
    <>
      <HeadElement
        title="Register Form"
        description="Registration form for GraveyardJS"
        url={new URL(props.url.href)}
      />
      <Layout pathname={props.url.pathname} user={props.user}>
        <div class="mx-auto max-w-sm w-full py-10 p-8">
          <h1 class="py-6 text-4xl text-gray-900 text-center font-extrabold">
            Join GraveyardJS
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
              Create Account
            </button>
          </form>
          {props.data?.err?.message.length > 0 && (
            <>
              <div>{props.data.err.message}</div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
