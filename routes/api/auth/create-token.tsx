import { Handlers } from "$fresh/server.ts";
import { createAPIToken } from "../../../lib/jwt.ts";
import { calcFullYearFromNow } from "../../../lib/date-time.ts";
import prisma from "../../../lib/prisma-client.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const { user } = await req.json();
      const apiToken = await createAPIToken(user, calcFullYearFromNow());
      console.log({ ["create-token"]: user });

      await prisma.users.update({
        where: {
          user_id: user.sub,
        },
        data: {
          jwt_token: apiToken,
        },
      });

      return new Response(
        JSON.stringify({
          message: "Generated API token successfully",
          token: apiToken,
        }),
        { status: 200, statusText: "OK" }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          message: `Something went wrong: ${err.message}`,
          error: err,
        })
      );
    }
  },
};
