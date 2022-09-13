import { ComponentChildren } from "preact";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import NavBar from "./NavBar.tsx";
import { JWTUserCredentials } from "../utils/types.ts";

type LayoutProps = {
  children: ComponentChildren;
  pathname: string;
  user: JWTUserCredentials | undefined;
};

export default function Layout(props: LayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <NavBar pathname={props.pathname} user={props.user} />
      {props.children}
      <Footer />
    </div>
  );
}
