import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { getDashboardRoute } from "@/app/data/routes/dashboard-route";
import RenderRoutes from "./RenderRoutes";

interface navigationItemsProps {
  name: string;
  href: string;
}

let navigationItems: navigationItemsProps[] = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
];

const Navbar = async () => {
  const { dashboardRoute, session } = await getDashboardRoute();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto min-h-16 flex items-center gap-8 px-4 md:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" className="size-9 rounded-lg" />
          <span className="font-bold">HelmyLMS</span>
        </Link>

        <nav className="flex flex-1 md:items-center justify-end md:justify-between">
          <div className="hidden md:flex items-center gap-4">
            <RenderRoutes navigationItems={navigationItems} />
            {dashboardRoute.href !== "/login" && (
              <Link href={dashboardRoute.href} className="text-sm font-medium transition-colors hover:text-primary">
                {dashboardRoute.name}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {session ? (
              <>
                <UserDropdown
                  name={session?.user.name && session?.user.name.length > 0 ? session.user.name : session.user.email.split("@")[0]}
                  email={session.user.email}
                  image={session.user.image || `https://avatar.vercel.sh/${session?.user.email}`}
                  dashboardHref={dashboardRoute.href}
                />
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
