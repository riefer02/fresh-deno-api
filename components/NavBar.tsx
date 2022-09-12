import { isActivePage } from "../utils/navigation.ts";

interface NavBarProps {
  pathname: string;
}

export default function NavigationBar(props: NavBarProps) {
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
    {
      name: "Join",
      href: "/user/join",
    },
  ];

  return (
    <nav class="bg-purple-200 py-2">
      <ul class="flex justify-center gap-8 mx-4">
        {items.map((item) => (
          <li>
            <a
              href={item.href}
              class={`text-gray-600 hover:underline ${
                isActivePage(item.href, props.pathname) ? "font-bold" : ""
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
