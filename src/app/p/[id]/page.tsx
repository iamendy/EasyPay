"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { Plus, Minus, WalletMinimalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useBlockNumber,
} from "wagmi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { usePayment } from "@/hooks/usePayment";
import usdt from "@/constants/usdt";
import easypay from "@/constants/easypay";
import { updateListing } from "@/actions";
import { formatEther, parseEther, stringToHex } from "viem";
import { useEffect } from "react";
import PaymentCard from "@/components/PaymentCard";
import { useFormState } from "react-dom";
import Container from "@/components/Container";

//initial state for form action
const initialState = {
  listingId: "",
  amount: "",
  buyer: "",
  quantity: "",
};

export default function ListingPage({ params }: { params: { id: string } }) {
  const { address } = useAccount();
  const { toast } = useToast();
  const { open, setOpen, setProgress } = usePayment();
  const { writeContractAsync, data: hash } = useWriteContract();
  const { writeContractAsync: payWrite, data: payHash } = useWriteContract();
  const queryClient = useQueryClient();
  const buttonRef = useRef(null);
  const [txt, setTxt] = useState("approving");
  const [check, setCheck] = useState(0);
  const [available, setAvailable] = useState(0);
  //@ts-ignore to update payment
  const [message, formAction] = useFormState(updateListing, initialState);
  // to control quantity input
  const [quantity, setQuantity] = useState(1);
  const [soldOut, setSoldOut] = useState(false);

  // watch block for auto update
  const bn = useBlockNumber({
    watch: true,
  });

  //check balance
  const { data: balance, refetch: reloadBal } = useReadContract({
    abi: usdt?.abi,
    //@ts-ignore
    address: usdt?.address,
    functionName: "balanceOf",
    args: [address],
  });

  //updates simulation
  useEffect(() => {
    reloadBal();
    refetch();
  }, [bn]);

  const getListing = async () => {
    const { data } = await axios.get(
      `/api/user/${address}/listings/${params?.id}`
    );
    return data;
  };

  const { isPending, data: listing } = useQuery({
    queryKey: ["listing"],
    queryFn: getListing,
    enabled: !!address,
  });

  // increase quantity
  const increment = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    quantity < available && setQuantity(quantity + 1);
  };

  // decrease quantity
  const decrement = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    quantity > 1 && setQuantity(quantity - 1);
  };

  // calculate total amount
  const totalAmount =
    quantity && listing?.rate
      ? parseEther((quantity * listing.rate).toString())
      : "0";

  // simulate cUSD approval
  const {
    data: approvalData,
    status,
    isFetching,
    failureReason,
  } = useSimulateContract({
    //@ts-ignore
    address: usdt?.address,
    abi: usdt?.abi,
    functionName: "approve",
    args: [easypay?.address, totalAmount],
    query: {
      enabled: !!listing && !!quantity,
    },
  });

  failureReason && console.log(failureReason);

  // approve easypay smart contract for user USDT
  const handleApproval = async () => {
    setOpen(true);
    await writeContractAsync?.(approvalData!.request);
    setProgress(65);
  };

  const { status: approvalStatus } = useWaitForTransactionReceipt({
    hash,
    confirmations: 2,
  });

  // simulate contract for add listing
  const {
    data: transferData,
    status: statusTf,
    isFetching: isFetchingTf,
    failureReason: failureReasonTd,
    refetch,
  } = useSimulateContract({
    //@ts-ignore
    address: easypay?.address,
    abi: easypay?.abi,
    functionName: "payForListing",
    args: [
      stringToHex(listing?.id, { size: 32 }),
      listing?.seller?.address,
      `${quantity}`,
      `${totalAmount}`,
    ],
  });

  // watch payment transaction
  const { status: paidStatus } = useWaitForTransactionReceipt({
    hash: payHash,
    confirmations: 1,
  });

  // handle payment
  const handlePayment = async () => {
    try {
      //update text
      setTxt("transferring");
      await refetch();
      await payWrite?.(transferData!.request);
      setCheck(2);
      setProgress(100);
    } catch (e) {
      console.log(e);
    }
  };

  //watch approval confirmation
  useEffect(() => {
    //if success, call payListing on smart contract
    if (approvalStatus === "success") {
      //update status
      setCheck(1);
      //initiate payment
      handlePayment();
    }
  }, [approvalStatus]);

  const updatePayment = () => {
    //@ts-ignore
    buttonRef?.current.click();
  };

  //watch payment confirmation
  useEffect(() => {
    //if success, call payListing on smart contract
    if (statusTf === "success") {
      //call server action to write payment
      updatePayment();

      //invalidate listing
      queryClient.invalidateQueries({ queryKey: ["listing"] });

      //notify user
      toast({
        title: "Success",
        description: "Thanks for your payment!",
      });
      setOpen(false);
      //reset progress
      setProgress(0);
    }
  }, [paidStatus]);

  //update available quantity
  useEffect(() => {
    if (listing?.quantity - listing?.sold == 0) {
      setSoldOut(true);
    } else {
      setAvailable(listing?.quantity - listing?.sold);
    }
  }, [listing]);

  return (
    <Container>
      <div className="w-[60%] mx-auto">
        <div className="flex justify-end underline pr-2">
          {hash && (
            <small>
              <a
                href={`https://optimism-sepolia.blockscout.com/tx/${hash}`}
                target="_blank"
              >
                View Txn{" "}
              </a>
            </small>
          )}
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <CardTitle className="group flex flex-row w-full justify-between items-center gap-2 text-lg">
              <span>{listing?.title}</span>
              <div className="flex items-center gap-x-1">
                <WalletMinimalIcon size={16} />
                <span>
                  $
                  {
                    //@ts-ignore
                    formatEther(balance || "0")
                  }
                </span>
              </div>
            </CardTitle>

            {/* <ConnectButton /> */}
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Description</div>
              <p className="text-muted-foreground">{listing?.description}</p>

              <Separator className="my-2" />

              <div className="font-semibold">Order Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span>${listing?.rate?.toFixed(2)}</span>
                </li>

                <li className="flex items-center justify-end">
                  <span className="text-muted-foreground">x {quantity}</span>
                </li>
              </ul>

              <Separator className="my-2" />

              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>${(listing?.rate * quantity)?.toFixed(2)}</span>
                </li>
              </ul>
              <ul className="grid gap-3"></ul>

              <div className="flex items-center justify-end mt-4">
                <div className="flex items-center justify-between gap-x-2 w-[50%]">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex justify-center items-center flex-1"
                    onClick={(e) => decrement(e)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex justify-center items-center flex-1"
                    onClick={(e) => increment(e)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  size="lg"
                  onClick={() => handleApproval()}
                  disabled={soldOut}
                  className="w-full"
                >
                  {soldOut ? "Sold Out " : "Make payment"}
                </Button>
              </div>
            </div>
          </CardContent>
          {/* Alert modal */}
          <AlertDialog open={open}>
            <AlertDialogContent className="border-none">
              <AlertDialogHeader>
                <AlertDialogDescription>
                  {/* Payment Card */}
                  <PaymentCard
                    listing={listing}
                    amount={quantity * listing?.rate}
                    txt={txt}
                    check={check}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row justify-end items-center gap-x-3 "></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>

        {/* Form to update succesful payment */}
        <form action={formAction} method="post">
          <input type="text" name="quantity" value={quantity} hidden />
          <input type="text" name="listingId" value={listing?.id} hidden />
          <input type="text" name="buyer" value={address} hidden />
          <input
            type="text"
            name="amount"
            value={listing?.rate * quantity}
            hidden
          />
          <button ref={buttonRef} type="submit"></button>
        </form>
      </div>
      <div className="text-center">
        <small className="text-muted-foreground">
          This payment link was generated with{" "}
          <a href="/" className="font-medium">
            EasyPay
          </a>
        </small>
      </div>
    </Container>
  );
}
