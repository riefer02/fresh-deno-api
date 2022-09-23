import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import dbPool from "../../utils/database-pool.ts";
import { isEmptyObject } from "../../utils/is-empty-object.ts";
import { userData } from "../../utils/user-signal.ts";

const dbConn = await dbPool.connect();
dbConn.release();

export const handler: Handlers = {
  GET(_req, ctx) {
    const user = userData.value;

    if (isEmptyObject(user))
      return new Response(
        JSON.stringify({ message: "Unauthenticated user, redirecting..." }),
        { status: 307, headers: { Location: "/user/login" } }
      );

    return ctx.render({ user });
  },
};

export default function ProfilePage(props: PageProps) {
  return (
    <Layout pathname={props.url.pathname}>
      <div class="p-4 mx-auto max-w-screen-md">
        Profile Page of {props.data.user.email}
      </div>
    </Layout>
  );
}
