import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies, deleteCookie } from "https://deno.land/std/http/cookie.ts";
import { Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { reqMiddlewareUrlBlackList } from "../utils/dev-blacklist.ts";
import { verifyJWT } from "../utils/jwt.ts";
interface State {
  user: Payload;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const cookies = getCookies(req.headers);

  if (
    reqMiddlewareUrlBlackList.includes(req.url) ||
    !cookies["graveyardjs-jwt"]
  ) {
    return ctx.next();
  }

  const jwt = cookies["graveyardjs-jwt"];
  const validUserData = await verifyJWT(jwt);

  if (!validUserData) {
    const res = new Response(
      JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
      { status: 401, headers: { Location: "/user/login" } }
    );

    deleteCookie(res.headers, "graveyardjs-jwt");

    return res;
  }

  ctx.state.user = validUserData;

  return await ctx.next();
}
