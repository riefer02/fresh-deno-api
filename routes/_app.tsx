import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>GraveyardJS</title>
        <meta
          name="description"
          content="A next-gen API for undead purposes and a library for long forgotten web components and utilities."
        />
      </Head>
      <props.Component />
    </>
  );
}
