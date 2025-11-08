"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";

interface navigationItemsProps {
  name: string;
  href: string;
}

const navigationItems: navigationItemsProps[] = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto min-h-16 flex items-center gap-8 px-4 md:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" className="size-9 rounded-lg" />
          <span className="font-bold">HelmyLMS</span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {navigationItems.map((item, index) => (
              <Link href={item.href} key={index} className="text-sm font-medium transition-colors hover:text-primary">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isPending ? null : session ? (
              <>
                <UserDropdown name={session.user.name} email={session.user.email} image={session.user.image || ""} />
              </>
            ) : (
              <>
                <Link href={"login"} className={buttonVariants({ variant: "secondary" })}>
                  Login
                </Link>
                <Link href={"login"} className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
