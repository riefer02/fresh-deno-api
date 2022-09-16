import { createContext } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps, Handlers, HandlerContext } from "$fresh/server.ts";

export const UserContext = createContext("username");

export default function App(props: AppProps) {
  console.log('app props', <props.Component/>)
  return (
    <>
      <Head>
        <title>GraveyardJS</title>
        <meta
          name="description"
          content="A next-gen API for undead purposes and a library for long forgotten web components and utilities."
        />
      </Head>
      <UserContext.Provider value="User Values">
        <props.Component />
      </UserContext.Provider>
    </>
  );
}
