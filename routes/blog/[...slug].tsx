import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { apply, tw } from "twind";
import { frontMatter, gfm } from "../../lib/markdown.ts";
import { formatBlogDate } from "../../lib/date-time.ts";
import { HeadElement } from "../../components/HeadElement.tsx";
import BlogSidebar from "../../components/BlogSidebar.tsx";
import Layout from "../../components/Layout.tsx";
import {
  SLUGS,
  TABLE_OF_CONTENTS,
  TableOfContentsEntry,
} from "../../content/blog/blog.ts";

interface Data {
  page: Page;
}

interface Page extends TableOfContentsEntry {
  markdown: string;
  data: Record<string, unknown>;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    if (slug === "") {
      return new Response("", {
        status: 307,
        headers: { location: "/blog/introduction" },
      });
    }
    const entry = TABLE_OF_CONTENTS[slug];
    if (!entry) {
      return new Response("404 Page not found", {
        status: 404,
      });
    }
    const url = new URL(`../../content/${entry.file}`, import.meta.url);
    const fileContent = await Deno.readTextFile(url);
    const { content, data } = frontMatter(fileContent) as {
      data: Record<string, string>;
      content: string;
    };
    const page = { ...entry, markdown: content, data: data ?? {} };
    const resp = ctx.render({ page });
    return resp;
  },
};

export default function BlogPage(props: PageProps<Data>) {
  let DESCRIPTION;
  const TITLE = `${props.data.page?.title} | GraveyardJS Blog` ?? "Not Found";

  if (props.data.page.data.description) {
    DESCRIPTION = String(props.data.page.data.description);
  }

  return (
    <>
      <HeadElement
        description={DESCRIPTION}
        title={TITLE}
        url={new URL(props.url.href)}
      />
      <Head>
        <link rel="stylesheet" href={`/gfm.css`} />
      </Head>

      <Layout pathname={props.url.pathname}>
        <div class="flex mx-auto max-w-screen-lg justify-end">
          <label
            for="docs_sidebar"
            class="px-4 pt-3 md:hidden flex items-center hover:bg-gray-100 rounded gap-2 text-gray-600"
          >
            <svg
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              ></path>
            </svg>
            <div>Menu</div>
          </label>
        </div>
        <Main path={props.url.pathname} page={props.data.page} />
      </Layout>
    </>
  );
}

function Title() {
  const title = tw`text(2xl gray-900) tracking-tight font-extrabold flex items-center gap-1`;
  const pageName = tw`font-light block pb-[1px]`;
  const subtitle = tw`text(sm gray-700)`;

  return (
    <>
      <a href="/" class={title}>
        GraveyardJS
        <span class={pageName}>blog</span>
      </a>
      <p class={subtitle}>The next-gen web API.</p>
    </>
  );
}

function Main(props: { path: string; page: Page }) {
  const main = tw`mx-auto max-w-screen-lg px-4 flex gap-6`;
  return (
    <div class="flex-1">
      <MobileSidebar path={props.path} />
      <div class={main}>
        <DesktopSidebar path={props.path} />
        <Content page={props.page} />
      </div>
    </div>
  );
}

function MobileSidebar(props: { path: string }) {
  const container = tw`fixed inset-0 flex z-40 hidden` + " toggled";
  const backdrop = tw`absolute inset-0 bg-gray-600 opacity-75`;
  const sidebar = tw`relative flex-1 flex flex-col w-[70vw] h-full bg-white border(r-2 gray-100)`;
  const heading = tw`p-4 border(b-2 gray-100) bg-purple-300`;
  const items = tw`pt-2 pb-16 px-4 overflow-x-auto`;
  return (
    <>
      <input
        type="checkbox"
        class={tw`hidden` + " toggle"}
        id="docs_sidebar"
        autocomplete="off"
      ></input>
      <div class={container}>
        <label class={backdrop} for="docs_sidebar" />
        <div class={sidebar}>
          <div class={heading}>
            <Title />
          </div>
          <nav class={items}>
            <BlogSidebar path={props.path} />
          </nav>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar(props: { path: string }) {
  return (
    <nav class="w-[16rem] flex-shrink-0 hidden md:block py-8 pr-4 border(r-2 gray-100)">
      <BlogSidebar path={props.path} />
    </nav>
  );
}

function Content(props: { page: Page }) {
  const main = tw`py-8 overflow-hidden`;
  const title = tw`text(4xl gray-900) tracking-tight font-extrabold mt-6`;
  const body = tw`mt-6`;
  const html = gfm.render(props.page.markdown);

  return (
    <main class={main}>
      <h1 class={title}>{props.page.title}</h1>
      {props.page.data?.date && (
        <sub>{formatBlogDate(props.page.data.date)}</sub>
      )}
      <div
        class={`${body} markdown-body bg-transparent`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ForwardBackButtons slug={props.page.slug} />
    </main>
  );
}

const button = apply`bg-gray-100 w-full border(1 gray-200) grid rounded-lg mb-4 py-1 px-2 text-gray-600 bg-gray-100 border-purple-200 border`;

function ForwardBackButtons(props: { slug: string }) {
  const currentIndex = SLUGS.findIndex((slug) => slug === props.slug);
  const previousSlug = SLUGS[currentIndex - 1];
  const nextSlug = SLUGS[currentIndex + 1];
  const previous = TABLE_OF_CONTENTS[previousSlug];
  const next = TABLE_OF_CONTENTS[nextSlug];

  const upper = tw`text(sm gray-600)`;
  const category = tw`font-normal`;
  const lower = tw`text-gray-900 font-medium`;

  return (
    <div class="mt-8 flex flex(col md:row) gap-4">
      {previous && (
        <a href={previous.href} class={tw`${button} text-left`}>
          <span class={upper}>{"←"} Previous</span>
          <span class={lower}>
            <span class={category}>
              {previous.category
                ? `${TABLE_OF_CONTENTS[previous.category].title}: `
                : ""}
            </span>
            {previous.title}
          </span>
        </a>
      )}
      {next && (
        <a href={next.href} class={tw`${button} text-right`}>
          <span class={upper}>Next {"→"}</span>
          <span class={lower}>
            <span class={category}>
              {next.category
                ? `${TABLE_OF_CONTENTS[next.category].title}: `
                : ""}
            </span>
            {next.title}
          </span>
        </a>
      )}
    </div>
  );
}
