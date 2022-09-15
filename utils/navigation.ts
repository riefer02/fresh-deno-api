export const isActivePage = (href: string, pathname: string) =>
  href === pathname || (href.includes("/blog") && pathname.includes("/blog"));

export const navigationItems = [
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
    hidePostLogin: true,
  },
  {
    name: "Join",
    href: "/user/join",
    hidePostLogin: true,
  },
  {
    name: "Profile",
    href: "user/profile",
    hidePreLogin: true,
  },
];
