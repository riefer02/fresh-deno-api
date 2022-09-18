import { createContext } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";
import { userData } from "../utils/user-signal.ts";

export const UserContext = createContext({});

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
      <UserContext.Provider value={userData.value}>
        <props.Component />
      </UserContext.Provider>
    </>
  );
}
