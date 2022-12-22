import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../../components/Layout.tsx";
import { HeadElement } from "../../../components/HeadElement.tsx";
import { HOSTNAME } from "../../../lib/environment.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const question = form.get("question");
    const res = await fetch(`${HOSTNAME}api/chat`, {
      method: "POST",
      body: JSON.stringify(question),
      headers: req.headers,
    });
    console.log({ apiResponse: res });
    const { message } = await res.json();

    return ctx.render({ message });
  },
};

export default function ChatPage(props: PageProps) {
  const chatResponse = props.data?.message;

  return (
    <>
      <HeadElement
        title="Chat Bot Companion"
        description="The Chat Bot Companion, an interal tool for graveyardjs, is an AI overlord who runs this domain. He stands before you ready to serve. Best to keep your wits about you."
        url={new URL(props.url.href)}
      />
      <Layout pathname={props.url.pathname}>
        <div class="min-h-[70vh]">
          <div class="mx-auto max-w-screen-md py-10 p-8 text-center">
            <h1 class="text-6xl font-bold mb-10 py-4 px-6">Chat Bot</h1>
            <form method="post" class="flex flex-col gap-y-4 max-w-sm mx-auto">
              <label for="question" class="text-2xl py-2 px-3">
                "Ask your question below."
              </label>
              <input
                type="question"
                name="question"
                class="rounded-lg py-1 px-2"
              />
              <button
                type="submit"
                class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
              >
                Submit
              </button>
            </form>
            {props.data?.err?.message.length > 0 && (
              <div>{props.data.err.message}</div>
            )}
          </div>
          <div class="max-w-xl mx-auto">
            {chatResponse && (
              <div
                class="text-xl px-2 py-2 pb-10 whitespace-normal max-w-xl mx-auto"
                // dangerouslySetInnerHTML={{ __html: chatResponse }}
              >
                {chatResponse}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
