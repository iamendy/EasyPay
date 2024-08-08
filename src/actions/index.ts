//@ts-nocheck
"use server";

import { NextResponse } from "next/server";
import prisma from "../../prisma";
import resolveUser from "@/helpers/resolveUser";
import getUniqueId from "@/helpers/uidGenerator";

export async function createListing(prevState: any, formData: FormData) {
  const listingData = {
    title: formData.get("title"),
    rate: formData.get("rate"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    address: formData.get("address"),
  };

  try {
    //@ts-ignore resolve user
    const user = await resolveUser(listingData.address);
    const uid = await getUniqueId();

    const listing = await prisma.listing.create({
      data: {
        title: listingData.title,
        description: listingData.description,
        rate: parseFloat(listingData.rate),
        quantity: parseInt(listingData.quantity),
        uid,
        sellerId: user.id,
      },
    });

    return listing;
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
}

export async function updateListing(prevState: any, formData: FormData) {
  const listingData = {
    id: formData.get("listingId"),
    quantity: formData.get("quantity"),
    amount: formData.get("amount"),
    buyer: formData.get("buyer"),
  };

  console.log(listingData);

  // fetch listing
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingData.id,
    },
  });

  // create payment
  await prisma.listingPayment.create({
    data: {
      listingId: listing?.id,
      amount: parseFloat(listingData?.amount),
      buyer: listingData.buyer,
      quantity: parseInt(listingData?.quantity),
    },
  });

  //update sold
  await prisma.listing.update({
    where: {
      id: listingData.id,
    },
    data: {
      sold: parseInt(parseInt(listingData?.quantity) + listing?.sold),
    },
  });

  return true;
}
