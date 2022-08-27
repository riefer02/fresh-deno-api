/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { HeartIcon } from "../components/Icons.tsx";
import VERSIONS from "../versions.json" assert { type: "json" };

const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeStyle: "long",
  hour12: false,
});

export const handler: Handlers = {
  GET(req, ctx) {
    const accept = req.headers.get("accept");
    if (accept && !accept.includes("text/html")) {
      const path = `https://deno.land/x/fresh@${VERSIONS[0]}/init.ts`;
      return new Response(`Redirecting to ${path}`, {
        headers: { Location: path },
        status: 307,
      });
    }
    return ctx.render();
  },
};

const TITLE = "GraveyardJS - The next-gen web API.";
const DESCRIPTION =
  "Welcome to GraveyardJS, next-generation API tool for the legendary heroes of our day.";

export default function MainPage(props: PageProps) {
  const ogImageUrl = new URL(asset("/jerry-the-ghost-200w.png"), props.url)
    .href; // TODO: Create/Update ogImage
  const origin = `${props.url.protocol}//${props.url.host}`;
  console.log(`origin: ${origin}`);

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
      <div class={tw`flex flex-col min-h-screen`}>
        <div class={tw`flex-1`}>
          <Header active="/" />
          <Intro />
        </div>
        <Footer />
      </div>
    </>
  );
}

export interface ListItemProps {
  children: ComponentChildren;
}

function ListItem(props: ListItemProps) {
  return (
    <div class={tw`flex mt-3 items-center`}>
      <HeartIcon />
      <div class={tw`pl-4 flex-1`}>{props.children}</div>
    </div>
  );
}

function Intro() {
  const title = tw`py-4 text(4xl sm:4xl lg:4xl gray-900 center) sm:tracking-tight font-extrabold`;

  return (
    <section
      class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
    >
      <picture>
        <img
          src="/jerry-the-ghost-200w.png"
          class={tw`w-20 mx-auto`}
          width={800}
          height={678}
          alt="Jerry is hovering in place"
        />
      </picture>

      <h2 class={title}>The Next-Gen API.</h2>

      <p class={tw`text-gray-600`}>
        GraveyardJS is a next generation web API, built for speed, reliability,
        and simplicity. Some stand out features: {timeFmt.format(new Date())}
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

      <p class={tw`text-gray-600`}>
        GraveyardJS embraces the tried and true design of server side rendering
        and progressive enhancement on the client side.
      </p>
    </section>
  );
}
