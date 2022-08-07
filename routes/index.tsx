/** @jsx h */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import Counter from "../islands/Counter.tsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <Fragment>
      <Header active="/" />
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <img
          src="/logo.svg"
          height="100px"
          alt="the graveyardjs logo: a sliced lemon dripping with juice"
        />
        <p class={tw`my-6`}>
          Welcome to Riefer's Little Big Secret API - The key to an unknown
          world
        </p>
        <Counter start={3} />
      </div>
      <Footer />
    </Fragment>
  );
}
