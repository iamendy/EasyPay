import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import ProgressBar from "./ProgressBar";
import cusd from "@/constants/usdt";
import easypay from "@/constants/easypay";
import {
  useWriteContract,
  useSimulateContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { Listing as ListingType } from "@prisma/client";
import { useEffect } from "react";

export default function Component({
  listing,
  amount,
  txt,
  check,
}: {
  listing: ListingType;
  amount: number;
  txt: string;
  check: number;
}) {
  return (
    <div>
      <Card className="sm:col-span-2 text-left">
        <CardHeader className="pb-3">
          <ProgressBar />

          <CardDescription className="max-w-lg text-balance leading-relaxed text-xs mb-2">
            {txt}..
          </CardDescription>
          <CardContent className="px-0 pb-1 pt-2 flex gap-x-4">
            <div className="flex items-center gap-x-1">
              {check > 0 && <CircleCheck className="w-4 h-4" />}{" "}
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-x-1">
              {check > 1 && <CircleCheck className="w-4 h-4" />}
              <span>Transferred</span>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
