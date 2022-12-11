import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import { Payload } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { verifyJWT } from "../../lib/jwt.ts";

interface State {
  user: Payload;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  return await ctx.next();

  const cookies = getCookies(req.headers);

  if (!cookies["graveyardjs-jwt"])
    return new Response(
      JSON.stringify({ message: "You do not have authorization" })
    );

  const jwt = cookies["graveyardjs-jwt"];
  const validUserData = await verifyJWT(jwt);

  if (!validUserData) {
    const res = new Response(
      JSON.stringify({ message: "You do not have authorization" }),
      { status: 404 }
    );

    return res;
  }

  return await ctx.next();
}
