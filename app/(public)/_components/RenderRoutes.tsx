"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface RenderRoutesProps {
  navigationItems: {
    name: string;
    href: string;
  }[];
}

const RenderRoutes = ({ navigationItems }: RenderRoutesProps) => {
  const pathname = usePathname();
  const route = pathname.split("/")[1];
  return (
    <>
      {navigationItems.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            item.name.toLowerCase() === route || (item.name === "Home" && route === "") ? "text-primary" : ""
          }`}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default RenderRoutes;
