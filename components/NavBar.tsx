import { isActivePage } from "../lib/navigation.ts";
import { navigationItems } from "../lib/navigation.ts";
import { useContext } from "preact/hooks";
import { UserContext } from "../routes/_app.tsx";
import { isEmptyObject } from "../lib/is-empty-object.ts";

interface NavBarProps {
  pathname: string;
}

export default function NavigationBar(props: NavBarProps) {
  const user = useContext(UserContext);

  return (
    <nav class="bg-purple-200 py-2">
      <ul class={`grid grid-flow-col auto-cols-max mx-auto sm:flex text-center lg:text-left justify-center gap-6 sm:gap-8 mx-4`}>
        {navigationItems.map((item) => {
          if (
            item.linkType === "always" ||
            (!isEmptyObject(user) && item.linkType === "authenticated") ||
            (isEmptyObject(user) && item.linkType === "unauthenticated")
          ) {
            return (
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
            );
          }
        })}
        {!isEmptyObject(user) && (
          <form action="/api/auth/logout" method="POST">
            <input
              type="submit"
              name="logout"
              value="Logout"
              class="bg-transparent text-gray-600 cursor-pointer hover:underline"
            />
          </form>
        )}
      </ul>
    </nav>
  );
}
