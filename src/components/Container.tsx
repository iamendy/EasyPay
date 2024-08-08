const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="px-4 py-2 max-w-4xl mx-auto">{children}</div>;
};
export default Container;
