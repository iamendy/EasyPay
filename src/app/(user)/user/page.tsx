"use client";

import Transactions from "@/components/Transactions";
import AccountCard from "@/components/AccountCard";

export default function Component() {
  return (
    <section>
      <h3 className="mb-2 lg:mb-6">Welcome,</h3>
      <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-x-10">
        <AccountCard />

        <Transactions />
      </div>
    </section>
  );
}
