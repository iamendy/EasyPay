import { PaymentProvider } from "@/contexts/payment-context";

const PaymentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <PaymentProvider>{children}</PaymentProvider>;
};
export default PaymentLayout;
