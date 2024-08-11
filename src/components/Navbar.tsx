import Link from "next/link";
import Container from "@/components/Container";
import ToggleMode from "@/components/ToggleMode";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <nav className="border-b border-b-gray-100 dark:border-b-card py-1 lg:mb-7 lg:py-4">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="font-bold lg:text-lg">
              EasyPay
            </Link>
          </div>

          <div className="flex items-center gap-x-1">
            <ToggleMode />
            <ConnectButton
              showBalance={false}
              chainStatus={"icon"}
              accountStatus={"avatar"}
            />
          </div>
        </div>
      </Container>
    </nav>
  );
};
export default Navbar;
