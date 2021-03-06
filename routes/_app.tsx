/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>GraveyardJS</title>
        <meta name="description" content="A library for long forgotten web components and utilities." />
      </Head>
      <props.Component />
    </>
  );
}
