"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import easypay from "@/constants/easypay";
import { parseEther, stringToHex } from "viem";
import { createListing } from "@/actions";
import { useFormState, useFormStatus } from "react-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  useWriteContract,
  useSimulateContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";

export default function Create() {
  const { address } = useAccount();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { writeContractAsync, data: hash } = useWriteContract();

  const [isLoading, setIsLoading] = useState(false);
  // to control quantity input
  const [quantity, setQuantity] = useState(1);

  const initialState = {
    title: "",
    rate: 0,
    quantity,
    description: "",
  };

  // form status
  const { pending } = useFormStatus();

  //@ts-ignore
  const [newListing, formAction] = useFormState(createListing, initialState);

  // increase quantity
  const increment = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    quantity >= 1 && setQuantity(quantity + 1);
  };

  // decrease quantity
  const decrement = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    quantity > 1 && setQuantity(quantity - 1);
  };

  //simulate contract to validate args
  const { data, status, isFetching } = useSimulateContract({
    //@ts-ignore
    address: easypay?.address,
    abi: easypay?.abi,
    functionName: "addListing",
    args: [
      //@ts-ignore
      stringToHex(newListing?.id, { size: 32 }),
      //@ts-ignore
      parseEther(`${newListing?.rate}` || "0"),
      //@ts-ignore
      `${newListing.quantity}`,
    ],
    query: {
      enabled: !!newListing,
    },
  });

  //write listing to smart contract
  const write0x = async () => {
    await writeContractAsync?.(data!.request);
    toast({
      title: "Success",
      description: "Listing created successfully!",
      dir: "up",
    });
    queryClient.invalidateQueries({ queryKey: ["listings"] });
    queryClient.invalidateQueries({ queryKey: ["tnxs"] });
  };

  const { status: confirmStatus } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  //watch for listing creation
  useEffect(() => {
    //activate loader
    if (newListing.status === 0) {
      setIsLoading(true);
      //write listing to smart contract when validation is success
      if (status === "success") {
        write0x();
      }
    }
  }, [newListing, status]);

  //watch for on-chain confirmation
  useEffect(() => {
    if (confirmStatus === "success") {
      //@ts-ignore switch to listing view
      router.push(`/listings/${newListing.uid}?tx=${hash}`);
    }
  }, [confirmStatus]);

  return (
    <section>
      <div className="relative flex-col items-start gap-8 md:flex">
        <form action={formAction} className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Create a listing
            </legend>

            <input
              type="text"
              name="address"
              value={address}
              aria-hidden
              hidden
            />

            <div className="grid gap-3">
              <Label htmlFor="temperature">Title</Label>
              <Input
                id="temperature"
                type="text"
                placeholder="Ankara textile"
                name="title"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="rate">Price</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="200"
                name="rate"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-x-3">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="5"
                  name="quantity"
                  value={quantity}
                  //@ts-ignore
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <div className="flex items-center justify-between gap-x-2">
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
            </div>

            <div className="grid gap-3">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                placeholder="Nike Air Jordan"
                className="min-h-4"
                name="description"
                rows={5}
              />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={pending || isLoading}
                size="lg"
                className="w-fit"
              >
                {(pending || isLoading) && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create listing
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
