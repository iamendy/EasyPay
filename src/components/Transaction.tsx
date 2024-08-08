import { Badge } from "./ui/badge";
import Link from "next/link";
import { Listing } from "@prisma/client";
const Transaction = ({ listing }: { listing: Listing }) => {
  return (
    <Link href={`/listings/${listing?.uid}`} className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between border bg-card p-3 rounded-md">
        <div className="flex gap-x-2 justify-start items-center">
          <div className="flex items-center gap-x-1">
            <small className=" ">{listing?.title}</small>
            {listing?.quantity > 1 && (
              <small className="text-muted-foreground">
                x{listing?.quantity}
              </small>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            {listing?.quantity - listing?.sold == 0 && (
              <Badge className="text-xs" variant="secondary">
                SoldOut
              </Badge>
            )}
            <p className="text-sm">${listing?.rate * listing?.quantity}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Transaction;
