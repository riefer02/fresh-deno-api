import { Handlers } from "$fresh/server.ts";
import { compareSync } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { createJWT } from "../../../lib/jwt.ts";
import { calcFullYearFromNow } from "../../../lib/date-time.ts";
import prisma from "../../../lib/prisma-client.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response(
      JSON.stringify({
        message:
          "Make a POST request with the proper credentials to generate an API token",
      })
    );
  },

  async POST(req, _ctx) {
    const { email, password } = await req.json();

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await compareSync(password, user.password))) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const jwt = await createJWT(user, calcFullYearFromNow());

    return new Response(
      JSON.stringify({
        message: "Generated API token successfully",
        token: jwt,
      }),
      { status: 200, statusText: "OK" }
    );
  },
};
