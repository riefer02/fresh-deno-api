import { isActivePage } from "../utils/navigation.ts";
import { JWTUserCredentials } from "../utils/types.ts";
import { navigationItems } from "../utils/navigation.ts";
import { useContext } from "preact/hooks";
import { UserContext } from "../routes/_app.tsx";
import { isEmptyObject } from "../utils/is-empty-object.ts";

interface NavBarProps {
  pathname: string;
  user: JWTUserCredentials | unknown;
}

export default function NavigationBar(props: NavBarProps) {
  const user = useContext(UserContext);

  console.log("Navbar User:", isEmptyObject(user));

  return (
    <nav class="bg-purple-200 py-2">
      <ul class="flex justify-center gap-8 mx-4">
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
      </ul>
    </nav>
  );
}
