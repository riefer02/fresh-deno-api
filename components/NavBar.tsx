import { isActivePage } from "../utils/navigation.ts";
import { JWTUserCredentials } from "../utils/types.ts";
import { navigationItems } from "../utils/navigation.ts";

interface NavBarProps {
  pathname: string;
  user: JWTUserCredentials | unknown;
}

export default function NavigationBar(props: NavBarProps) {
  return (
    <nav class="bg-purple-200 py-2">
      <ul class="flex justify-center gap-8 mx-4">
        {navigationItems.map((item) => {
          if (props.user && item.hidePostLogin) return;
          if (!props.user && item.hidePreLogin) return;
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
        })}
      </ul>
    </nav>
  );
}
