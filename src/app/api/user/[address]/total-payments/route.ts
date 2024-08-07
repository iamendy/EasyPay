import { NextResponse } from "next/server";
import resolveUser from "@/helpers/resolveUser";
import prisma from "../../../../../../prisma";

//@ts-ignore
function sumPayments(listings) {
  //@ts-ignore
  return listings.map((listing) => {
    // Compute the total amount for payments
    const totalAmount = listing.payments.reduce(
      //@ts-ignore
      (acc, payment) => acc + payment.amount,
      0
    );

    return totalAmount;
  });
}

export const GET = async (
  request: Request,
  { params }: { params: { address: string } }
) => {
  try {
    //resolves user
    const user = await resolveUser(params.address);

    //get listing
    const listings = await prisma.listing.findMany({
      where: {
        sellerId: user?.id,
      },
      include: {
        payments: true,
      },
    });

    if (!listings) {
      throw Error("invalid listing");
    }

    const totalArray = sumPayments(listings);
    const total = totalArray.reduce((acc: any, curr: any) => acc + curr, 0);

    return NextResponse.json(total);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
