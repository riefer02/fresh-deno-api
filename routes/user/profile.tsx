/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import dbPool from "../../utils/database-pool.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import cryptoKey from "../../utils/crypto-key.ts";

const dbConn = await dbPool.connect();
dbConn.release();

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const token = cookies["graveyardjs-jwt"];
    console.log(decode(token));
    const [header, payload, signature] = decode(token);
    // console.log(signature === cryptoKey);

    console.log("GET");
    return ctx.render();
  },
};

export default function ProfilePage(props: PageProps) {
  return <div class={tw`p-4 mx-auto max-w-screen-md`}>Profile Page</div>;
}
