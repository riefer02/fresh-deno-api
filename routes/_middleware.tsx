// routes/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import cryptoKey from "../utils/crypto-key.ts";
import { reqMiddlewareUrlBlackList } from "../utils/dev-blacklist.ts";

interface State {
  user: string;
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

  const token = cookies["graveyardjs-jwt"];
  const [header, payload, signature] = decode(token);

  // Check signature of jwt

  // Verified get user data from
  ctx.state.user = "graveyardjs user";

  return await ctx.next();
}
