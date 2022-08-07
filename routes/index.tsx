/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import Counter from "../islands/Counter.tsx";
// import LemonDrop from "../islands/LemonDrop.tsx"; // Learn the magic behind this animation
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
// import { Leaf } from "../components/Icons.tsx"; // Make new SVG Icon
import VERSIONS from "../versions.json" assert { type: "json" };

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
  "Just in time edge rendering, island based interactivity, and no configuration TypeScript support using Deno.";

export default function MainPage(props: PageProps) {
  const ogImageUrl = new URL(asset("/jerry-the-ghost-200w.png"), props.url)
    .href; // TODO: Create/Update ogImage
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
      <div class={tw`flex flex-col min-h-screen`}>
        {/* <Hero /> */}
        <div class={tw`flex-1`}>
          <Header active="/" />
          <Intro />
          <GettingStarted origin={origin} />
          <Example />
        </div>
        <Footer />
      </div>
    </>
  );
}

function Hero() {
  const container = tw`w-full flex justify-center items-center flex-col bg-green-300`;
  const nav = tw`flex justify-end items-center bg-green-300`;
  const a = tw`border(1 black) inline-flex items-center h-10 px-4 m-4 text-black bg-transparent rounded hover:bg-white`;

  return (
    <Fragment>
      <div class={nav}>
        <a href="/blog" class={a}>
          Blog
        </a>
      </div>
      {/* <section class={container}>
        <LemonDrop />
      </section> */}
    </Fragment>
  );
}
export interface ListItemProps {
  children: ComponentChildren;
}

function ListItem(props: ListItemProps) {
  return (
    <div class={tw`flex mt-3`}>
      {/* <Leaf /> */}
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

      <h2 class={title}>The next-gen API.</h2>

      <p class={tw`text-gray-600`}>
        GraveyardJS is a next generation web API, built for speed, reliability,
        and simplicity. Some stand out features:
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
        Fresh embraces the tried and true design of server side rendering and
        progressive enhancement on the client side.
      </p>
    </section>
  );
}

function GettingStarted(props: { origin: string }) {
  return (
    <section
      class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
    >
      <h2 id="getting-started" class={tw`text(xl gray-600) font-bold`}>
        <a href="#getting-started" class={tw`hover:underline`}>
          Getting started
        </a>
      </h2>
      <p class={tw`text-gray-600`}>
        To get started, make sure you have the{" "}
        <a href="https://deno.land" class={tw`text-blue-600 hover:underline`}>
          Deno CLI
        </a>{" "}
        version 1.23.0 or higher installed.
      </p>
      <p class={tw`text-gray-600`}>
        Then you can use the GraveyardJS init script to bootstrap a new project:
      </p>
      <pre class={tw`overflow-x-auto py-2 px-4 bg(gray-100)`}>
        {`deno run -A -r ${props.origin} my-project`}
      </pre>
      <p class={tw`text-gray-600`}>
        Enter the newly created project directory and run the following command
        to start the development server:
      </p>
      <pre class={tw`overflow-x-auto py-2 px-4 bg(gray-100)`}>
        deno task start
      </pre>
      <p class={tw`text-gray-600`}>
        You can now open{" "}
        <a
          href="http://localhost:8000"
          class={tw`text-blue-600 hover:underline`}
        >
          http://localhost:8000
        </a>{" "}
        in your browser to view the page.
      </p>
      <p class={tw`text-gray-600`}>
        A more in-depth getting started guide is available in{" "}
        <a href="/blog" class={tw`text-blue-600 hover:underline`}>
          the blog
        </a>
        .
      </p>
    </section>
  );
}

const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeStyle: "long",
  hour12: false,
});

function Example() {
  return (
    <section
      class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
    >
      <h2 id="example" class={tw`text(xl gray-600) font-bold`}>
        <a href="#example" class={tw`hover:underline`}>
          Example
        </a>
      </h2>
      <p class={tw`text-gray-600`}>
        This text is being server side rendered on the fly. It was rendered at{" "}
        {timeFmt.format(new Date())}.
      </p>
      <p class={tw`text-gray-600`}>
        The counter below was rendered on the server with a starting value of 3,
        and was then hydrated on the client to provide interactivity. Try out
        the buttons!
      </p>
      <Counter start={3} />
      <p class={tw`text-gray-600`}>
        Only the JS required to render that counter is sent to the client.
      </p>
    </section>
  );
}
