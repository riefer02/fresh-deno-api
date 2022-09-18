import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "twind";
import { useSignal } from "@preact/signals";

export default function UseSignal() {
  const count = useSignal(0);
  const btn = tw`px-2 py-1 border(gray-100 1) hover:bg-gray-200`;
  return (
    <div class="flex gap-2 w-full">
      <p class="flex-grow-1 font-bold text-xl">{count.value}</p>
      <button class={btn} onClick={() => count.value--} disabled={!IS_BROWSER}>
        -1
      </button>
      <button class={btn} onClick={() => count.value++} disabled={!IS_BROWSER}>
        +1
      </button>
    </div>
  );
}
