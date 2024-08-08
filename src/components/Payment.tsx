//@ts-nocheck
import { ListingPayment } from "@prisma/client";
import { formatDate } from "@/helpers";

const Payment = ({ payment }: { payment: ListingPayment }) => {
  return (
    <div className="rounded-sm p-1 py-2 flex justify-between items-center border-b text-sm">
      <span>{formatDate(payment?.createdAt)}</span>
      <span>${payment?.amount}</span>
    </div>
  );
};
export default Payment;
