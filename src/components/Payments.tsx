"use client";

import { useAccount } from "wagmi";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Payment from "@/components/Payment";
import { useParams } from "next/navigation";
import { ListingPayment } from "@prisma/client";
import { Divide } from "lucide-react";

const Payments = () => {
  const { address, isConnecting } = useAccount();
  const params = useParams();

  const getPayments = async () => {
    const { data } = await axios.get(
      `/api/user/${address}/listings/${params?.id}/payments`
    );

    return data;
  };

  const { isPending: isLoading, data: payments } = useQuery({
    queryKey: ["user", address],
    queryFn: getPayments,
    enabled: !!address && !!params,
  });

  return (
    <div className="flex flex-col gap-y-3">
      {payments?.length > 0 ? (
        payments?.map((p: ListingPayment) => (
          <Payment key={p?.id} payment={p} />
        ))
      ) : (
        <div> No payments yet. </div>
      )}
    </div>
  );
};
export default Payments;
