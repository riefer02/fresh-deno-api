import { config } from "https://deno.land/x/dotenv/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.7/mod.ts";

interface UserLoginAttributes {
  sub: string;
  email: string;
  user_id: string;
}

const rawKey = Deno.env.get("PRIVATE_KEY") || config().PRIVATE_KEY;

const importKey = async (rawKey: string) =>
  await crypto.subtle.importKey(
    "jwk",
    JSON.parse(rawKey),
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

export const createSessionToken = async (
  user: UserLoginAttributes,
  expiration: number
) => {
  try {
    const importedKey = await importKey(rawKey);
    return await create(
      { alg: "HS512", typ: "JWT" },
      {
        sub: user.sub || user.user_id,
        email: user.email,
        exp: expiration,
        iss: "graveyardjs",
      },
      importedKey
    );
  } catch (err) {
    console.log(`Unable to create Session Token - Error: ${err.message}`);

    return false;
  }
};

export const verifyJWT = async (jwt: string) => {
  try {
    const key = await importKey(rawKey);

    return await verify(jwt, key);
  } catch (err) {
    console.log(
      `JWT failed validation. Invalid JWT token - Error: ${err.message}`
    );

    return false;
  }
};

export const createAPIToken = async (
  user: UserLoginAttributes,
  expiration: number
) => {
  try {
    const importedKey = await importKey(rawKey);

    return await create(
      { alg: "HS512", typ: "JWT" },
      {
        sub: user.sub,
        email: user.email,
        exp: expiration,
        iat: Date.now(),
        iss: "graveyardjs-api-token",
      },
      importedKey
    );
  } catch (err) {
    console.log(`Unable to create API Token - Error: ${err.message}`);

    return false;
  }
};
