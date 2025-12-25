import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import logo from "@/public/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft /> Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6 px-4 py-17">
        <Link href={"/"} className="flex items-center gap-2 self-center font-medium">
          <Image src={logo} alt="logo" width={32} height={32} className="rounded-lg" />
          HelmyLMS
        </Link>
        {children}
      </div>
    </div>
  );
}
