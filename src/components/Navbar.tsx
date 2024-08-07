import Link from "next/link";
import Container from "@/components/Container";
import ToggleMode from "@/components/ToggleMode";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <nav className="border-b border-b-gray-100 dark:border-b-card py-1">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="font-bold">
              EasyPay
            </Link>
          </div>

          <div className="flex items-center gap-x-1">
            <ToggleMode />
            <ConnectButton />
          </div>
        </div>
      </Container>
    </nav>
  );
};
export default Navbar;
