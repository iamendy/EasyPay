import Container from "@/components/Container";
import SideNav from "@/components/SideNav";

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container>
      <main className="lg:flex lg:items-start lg:gap-x-12 ">
        <SideNav />

        <div className="w-[70%]">{children}</div>
      </main>
    </Container>
  );
};
export default UserLayout;
