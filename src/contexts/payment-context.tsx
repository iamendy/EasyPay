"use client";

import { createContext, useState } from "react";

//interface
interface PaymentContextType {
  open: boolean;
  progress: number;
  setOpen: (open: boolean) => void;
  setProgress: (open: number) => void;
}

//context init
const PaymentContext = createContext<PaymentContextType | null>(null);

const PaymentProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //to control modal toggle
  const [open, setOpen] = useState(false);
  // to update progress bar
  const [progress, setProgress] = useState(10);

  return (
    <PaymentContext.Provider value={{ open, setOpen, progress, setProgress }}>
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentContext, PaymentProvider };
