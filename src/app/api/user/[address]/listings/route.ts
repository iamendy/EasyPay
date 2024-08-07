import { NextResponse } from "next/server";
import resolveUser from "../../../../../helpers/resolveUser";
import prisma from "../../../../../../prisma";

export const GET = async (
  request: Request,
  { params }: { params: { address: string; id: string } }
) => {
  try {
    //resolves user
    const user = await resolveUser(params.address);

    const listings = await prisma.listing.findMany({
      where: {
        sellerId: user.id,
      },
    });
    return NextResponse.json(listings);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
