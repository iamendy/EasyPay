"use client";

import Transactions from "@/components/Transactions";
import AccountCard from "@/components/AccountCard";

export default function Component() {
  return (
    <section>
      <div className="flex flex-col gap-y-6 ">
        <AccountCard />

        <Transactions />
      </div>
    </section>
  );
}
