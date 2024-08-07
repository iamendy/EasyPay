const Pancake = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <section className="pancake">{children}</section>;
};
export default Pancake;
