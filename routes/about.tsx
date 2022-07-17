// routes/about.tsx

/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { tw } from "@twind";

export const handler: Handlers = {
  async GET(req, ctx) {
    const resp = await ctx.render();
    resp.headers.set("X-Custom-Header", "Hello");
    return resp;
  },
};

export default function AboutPage() {
  return (
    <main>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <h1>About</h1>
        <p>This is the about page.</p>
      </div>
    </main>
  );
}
