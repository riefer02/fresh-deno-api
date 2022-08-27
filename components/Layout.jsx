/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import NavigationBar from "./NavigationBar.tsx";

export default function Layout({ children }) {
  return (
    <div class={tw`flex flex-col min-h-screen`}>
      <Header />
      <NavigationBar />
      {children}
      <Footer />
    </div>
  );
}
