export const isActivePage = (href: string, pathname: string) =>
  href === pathname || (href.includes("/blog") && pathname.includes("/blog"));

export const navigationItems = [
  {
    name: "Home",
    href: "/",
    linkType: "always",
  },
  {
    name: "Blog",
    href: "/blog",
    linkType: "always",
  },
  {
    name: "Login",
    href: "/user/login",
    linkType: "unauthenticated",
  },
  {
    name: "Join",
    href: "/user/join",
    linkType: "unauthenticated",
  },
  {
    name: "Profile",
    href: "/user/profile",
    linkType: "authenticated",
  },
  {
    name: "Chat",
    href: "/app/chat",
    linkType: "authenticated",
  },
  {
    name: "Ogg",
    href: "/app/convert/ogg",
    linkType: "authenticated",
  },
];
