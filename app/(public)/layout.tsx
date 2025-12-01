import { ReactNode } from "react";
import Navbar from "./_components/Navbar";

const LayoutPublic = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 mb-32 md:px-6 lg:px-8">{children}</main>
    </>
  );
};

export default LayoutPublic;
