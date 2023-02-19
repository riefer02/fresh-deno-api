import { ComponentChildren } from "preact";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import NavBar from "./NavBar.tsx";

type LayoutProps = {
  children: ComponentChildren;
  pathname: string;
};

export default function Layout(props: LayoutProps) {
  return (
    <div class="flex flex-col min-h-screen justify-between bg-opacity-10">
      <div>
        <Header />
        <NavBar pathname={props.pathname} />
        {props.children}
      </div>

      <Footer />
    </div>
  );
}
