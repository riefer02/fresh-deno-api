import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies, deleteCookie } from "https://deno.land/std/http/cookie.ts";
import { Payload } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { reqMiddlewareUrlBlackList } from "../lib/dev-blacklist.ts";
import { verifyJWT } from "../lib/jwt.ts";
import { userData } from "../lib/user-signal.ts";

interface State {
  user: Payload;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const cookies = getCookies(req.headers);

  if (!cookies["graveyardjs-jwt"]) userData.value = {};

  if (
    reqMiddlewareUrlBlackList.includes(req.url) ||
    !cookies["graveyardjs-jwt"]
  ) {
    return ctx.next();
  }

  const jwt = cookies["graveyardjs-jwt"];

  if (jwt === "") {
    userData.value = {};
    return ctx.next();
  }

  const validUserData = await verifyJWT(jwt);

  if (!validUserData) {
    const res = new Response(
      JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
      { status: 303, headers: { Location: "/user/login" } }
    );
    deleteCookie(res.headers, "graveyardjs-jwt");
    userData.value = {};

    return res;
  }

  userData.value = validUserData;

  return await ctx.next();
}
