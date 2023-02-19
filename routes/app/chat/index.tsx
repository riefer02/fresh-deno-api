import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../../components/Layout.tsx";
import { HeadElement } from "../../../components/HeadElement.tsx";
import { handler as chatBotHandler } from "../../api/chat/index.tsx";
import { inputStyles } from "../../../lib/styles.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    const res = await chatBotHandler.POST(req, ctx);
    const { message } = await res.json();

    return ctx.render({ message });
  },
};

export default function ChatPage(props: PageProps) {
  const chatResponse = props.data?.message;

  return (
    <>
      <HeadElement
        title="Terlingua Cowboy Chatbot"
        description="The Terlingua Cowboy Chatbot, an interal tool for graveyardjs, is an AI overlord who runs this domain. He stands before you ready to serve. Best to keep your wits about you."
        url={new URL(props.url.href)}
      />
      <Layout pathname={props.url.pathname}>
        <div class="min-h-[70vh]">
          <div class="mx-auto max-w-screen-md py-10 p-8 text-center">
            <h1 class="text-6xl font-bold mb-10 py-4 px-6">Terlingua Cowboy</h1>
            <form method="post" class="flex flex-col gap-y-4 max-w-xs mx-auto">
              <label for="question" class="text-2xl py-2 px-3">
                "Howdy, names Diego."
              </label>
              <input
                type="question"
                name="question"
                class={inputStyles}
                placeholder="Ask a question..."
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
              <div class="text-xl px-2 py-2 pb-10 whitespace-normal max-w-xl mx-auto">
                {chatResponse}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
