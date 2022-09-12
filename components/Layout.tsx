import { ComponentChildren } from "preact";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import NavigationBar from "./NavigationBar.tsx";

type LayoutProps = {
  children: ComponentChildren;
};

export default function Layout(props: LayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <NavigationBar />
      {props.children}
      <Footer />
    </div>
  );
}
