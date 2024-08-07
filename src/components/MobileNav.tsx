"use client";

import Link from "next/link";
import { Cog, Home, Up } from "../icons";
import { useState } from "react";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const [isOpen, setIsopen] = useState(false);
  const path = usePathname();

  return (
    <nav
      className={`${
        path.includes("/p") && "hidden"
      } fixed bottom-0 z-10 rounded-t-2xl  backdrop-blur-sm w-full p-4 lg:hidden`}
    >
      <div className="text-foreground flex justify-between items-center border rounded-lg px-5">
        <Link
          href={"/user"}
          className="flex flex-col items-center justify-center p-2"
        >
          <Home />
          <small>Account</small>
        </Link>
        <Link
          href="/listings/create"
          className="bg-gray-700 h-16 w-16 rounded-full flex items-center justify-center -translate-y-4 shadow-lg"
        >
          <Up />
        </Link>
        <Link
          href={"/listings"}
          className="flex flex-col items-center justify-center p-2"
        >
          <Cog />
          <small>Listings</small>
        </Link>
      </div>
    </nav>
  );
};
export default MobileNav;
