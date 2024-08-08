import Link from "next/link";

const SideNav = () => {
  return (
    <nav className="hidden w-[20%] lg:flex flex-col gap-y-2 border rounded-lg p-4">
      <Link
        href="/user"
        className="bg-slate-600 border rounded-lg px-2 py-1 text-white"
      >
        Dashboard
      </Link>

      <Link
        href="/listings"
        className="border rounded-lg px-2 py-1 hover:bg-slate-400"
      >
        Listings
      </Link>
    </nav>
  );
};
export default SideNav;
