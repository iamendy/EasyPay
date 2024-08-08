"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className="hidden w-[30%] lg:flex flex-col gap-y-2 border rounded-lg p-4">
      <Link
        href="/user"
        className={`${
          pathname.includes("/user") && "bg-slate-600 text-white"
        }   border rounded-lg px-2 py-1  hover:bg-slate-400`}
      >
        Dashboard
      </Link>

      <Link
        href="/listings"
        className={`${
          pathname.includes("/listings") && "bg-slate-600 text-white"
        }   border rounded-lg px-2 py-1  hover:bg-slate-400`}
      >
        Listings
      </Link>
    </nav>
  );
};
export default SideNav;
