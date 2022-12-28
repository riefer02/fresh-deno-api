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
  const cookies = getCookies(req.headers);

  // refactor to utility function...
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
    
  // Todo generate API tokens for user leveraging authorization headers...
  if (authHeader !== "test" && !cookies["graveyardjs-jwt"]) {
    return new Response(
      JSON.stringify({ message: "You do not have authorization" })
    );
  }

  // If authorization header is valid...
  if (authHeader) return await ctx.next();

  // Else check user jwt credentials
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
