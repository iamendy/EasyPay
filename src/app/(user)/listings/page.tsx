"use client";

import Transaction from "@/components/Transaction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { useAccount } from "wagmi";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function ListingsPage() {
  const { address } = useAccount();

  const getListings = async () => {
    const { data } = await axios.get(`/api/user/${address}/listings`);

    return data;
  };

  const { isPending, data: listings } = useQuery({
    queryKey: ["listings", address],
    queryFn: getListings,
    enabled: !!address,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <h3 className="font-bold">My Listings</h3>
        <Link
          href="/listings/create"
          className="w-fit px-4 rounded-md py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 leading-none"
        >
          + New Listing
        </Link>
      </CardHeader>
      <CardContent>
        {listings?.length > 0 ? (
          <div className="flex flex-col gap-y-4">
            {
              //@ts-ignore
              listings?.map((listing) => (
                <Transaction key={listing?.id} listing={listing} />
              ))
            }
          </div>
        ) : (
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Ooops</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                No listing found.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant={"secondary"}>
                <Link href={`/listings/create`}>Create New Listing</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
