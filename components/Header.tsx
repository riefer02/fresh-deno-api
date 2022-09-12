import { asset } from "$fresh/runtime.ts";

export default function Header() {
  return (
    <div class="bg-purple-400">
      <header class="mx-auto max-w-screen-lg flex gap-3 justify-between  w-full">
        <div class="p-4 flex">
          <a href="/" class="flex mr-3 items-center">
            <img
              src={asset("/jerry-the-ghost-200w.png")}
              alt="Jerry the Ghost"
              class="h-20"
            />
          </a>
          <div class="h-full flex flex-col justify-center">
            <a
              href="/"
              class="text-2xl text-gray-900 tracking-tight font-extrabold flex items-center gap-1"
            >
              GraveyardJS
            </a>
            <p class="text-sm text-gray-900">The next-gen API.</p>
          </div>
        </div>
      </header>
    </div>
  );
}
