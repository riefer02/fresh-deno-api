/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function NavigationBar() {
  const active = Math.random() > 0 ? "Home" : "Blog";
  const items = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "Login",
      href: "/user/login",
    },
  ];

  return (
    <nav class={tw`bg-purple-200 py-2`}>
      <ul class={tw`flex justify-center gap-8 mx-4`}>
        {items.map((item) => (
          <li>
            <a
              href={item.href}
              class={tw`text-gray-600 hover:underline ${
                active === item.href ? "font-bold" : ""
              }`}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
