/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import dbPool from "../../utils/database-pool.ts";

const dbConn = await dbPool.connect();
dbConn.release();

export const handler: Handlers = {
  GET(req, ctx) {
    const user = ctx.state.user;

    return ctx.render({ user });
  },
};

export default function ProfilePage(props: PageProps) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      Profile Page of {props.data.user.email}
    </div>
  );
}
