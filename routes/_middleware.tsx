// routes/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import { verify, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { reqMiddlewareUrlBlackList } from "../utils/dev-blacklist.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

interface State {
  user: Payload;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const cookies = getCookies(req.headers);

  if (reqMiddlewareUrlBlackList.includes(req.url)) {
    return ctx.next();
  }

  if (!cookies["graveyardjs-jwt"]) {
    return ctx.next();
  }

  const jwt = cookies["graveyardjs-jwt"];

  const jwk = Deno.env.get("PRIVATE_KEY") || config().PRIVATE_KEY;

  const reimportedKey = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(jwk),
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

  const validUserData = await verify(jwt, reimportedKey);

  ctx.state.user = validUserData;

  return await ctx.next();
}
