export const isActivePage = (href: string, pathname: string) =>
  href === pathname || (href.includes("/blog") && pathname.includes("/blog"));
