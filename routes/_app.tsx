import { createContext } from "preact";
import { AppProps } from "$fresh/server.ts";
import { userData } from "../lib/user-signal.ts";

export const UserContext = createContext({});

export default function App(props: AppProps) {
  return (
    <UserContext.Provider value={userData.value}>
      <props.Component />
    </UserContext.Provider>
  );
}
