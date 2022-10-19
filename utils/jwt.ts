import { config } from "https://deno.land/x/dotenv/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { jwtExpirationTime } from "./date-time.ts";

const rawKey = Deno.env.get("PRIVATE_KEY") || config().PRIVATE_KEY;

const importKey = async (rawKey: string) =>
  await crypto.subtle.importKey(
    "jwk",
    JSON.parse(rawKey),
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

export const createJWT = async (user) => {
  try {
    const reimportedKey = await importKey(rawKey);

    return await create(
      { alg: "HS512", typ: "JWT" },
      {
        sub: user.id,
        email: user.email,
        exp: jwtExpirationTime(),
        iss: "graveyardjs",
      },
      reimportedKey
    );
  } catch (err) {
    console.log(err);

    return false;
  }
};

export const verifyJWT = async (jwt) => {
  try {
    const key = await importKey(rawKey);

    return await verify(jwt, key);
  } catch (err) {
    console.log(err);

    return false;
  }
};
