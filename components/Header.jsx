import { h, Fragment } from "preact";
import { tw } from "@twind";
import { asset } from "$fresh/runtime.ts";

/** @jsx h */
export default function Header() {
  return (
    <Fragment>
      <div class={tw`bg-purple-400`}>
        <header class={tw`mx-auto max-w-screen-lg flex gap-3 justify-between`}>
          <div class={tw`p-4 flex`}>
            <a href="/" class={tw`flex mr-3 items-center`}>
              <img
                src={asset("/jerry-the-ghost-200w.png")}
                alt="Gerry the Ghost"
                class={tw`h-20`}
              />
            </a>
            <div class={tw`h-full flex flex-col justify-center`}>
              <a
                href="/"
                class={tw`text-2xl text-gray-900 tracking-tight font-extrabold flex items-center gap-1`}
              >
                GraveyardJS
              </a>
              <p class={tw`text-sm text-gray-900`}>The next-gen API.</p>
            </div>
          </div>
        </header>
      </div>
      <div class={tw`bg-purple-300 py-2`}>
        <ul class={tw`flex justify-center gap-8 mx-4`}>
          <li>
            <a href="/" class="text-gray-600 hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/docs" class="text-gray-600 hover:underline font-bold">
              Docs
            </a>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
