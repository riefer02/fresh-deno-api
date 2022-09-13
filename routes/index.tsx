import { ComponentChildren } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { HeartIcon } from "../components/Icons.tsx";
import { timeFmt } from "../utils/date-time.ts";
import { JWTUserCredentials } from "../utils/types.ts";

export const handler: Handlers = {
  GET(_req: Request, ctx: HandlerContext) {
    let user: JWTUserCredentials | undefined | unknown;

    if (ctx.state.user) {
      user = ctx.state.user;
    }

    return ctx.render({ user });
  },
};

interface HomePageProps extends PageProps {
  user: JWTUserCredentials;
}

const TITLE = "GraveyardJS - The next-gen web API.";
const DESCRIPTION =
  "Welcome to GraveyardJS, next-generation API tool for the legendary undead heroes of the world.";

export default function MainPage(props: HomePageProps) {
  const ogImageUrl = new URL(asset("/jerry-the-ghost-200w.png"), props.url)
    .href;
  const origin = `${props.url.protocol}//${props.url.host}`;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={props.url.href} />
        <meta property="og:image" content={ogImageUrl} />
      </Head>
      <Layout pathname={props.url.pathname} user={props.data.user}>
        <Intro />
      </Layout>
    </>
  );
}

export interface ListItemProps {
  children: ComponentChildren;
}

function ListItem(props: ListItemProps) {
  return (
    <div class="flex mt-3 items-center">
      <HeartIcon />
      <div class="pl-4 flex-1">{props.children}</div>
    </div>
  );
}

function Intro() {
  const title = `py-4 text(4xl sm:4xl lg:4xl gray-900 center) sm:tracking-tight font-extrabold`;

  return (
    <section class="max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4">
      <picture>
        <img
          src="/jerry-the-ghost-200w.png"
          class="w-20 mx-auto"
          width={800}
          height={678}
          alt="Jerry is hovering in place"
        />
      </picture>

      <h2 class={title}>The next-gen API.</h2>

      <p class="text-gray-600">
        GraveyardJS is a next gen web API, built for speed, reliability, and
        simplicity. Some stand out features: {timeFmt.format(new Date())}
      </p>

      <div>
        <ListItem>
          <b>Just-in-time rendering</b> on the edge.
        </ListItem>
        <ListItem>
          <b>Island based client hydration</b> for maximum interactivity.
        </ListItem>
        <ListItem>
          <b>Zero runtime overhead</b>: no JS is shipped to the client by
          default.
        </ListItem>
        <ListItem>
          <b>No build step</b>.
        </ListItem>
        <ListItem>
          <b>No configuration</b> necessary.
        </ListItem>
        <ListItem>
          <b>TypeScript support</b> out of the box.
        </ListItem>
      </div>

      <p class="text-gray-600">
        GraveyardJS embraces the tried and true design of server side rendering
        and progressive enhancement on the client side.
      </p>
    </section>
  );
}
