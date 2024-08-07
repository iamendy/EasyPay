import { NextResponse } from "next/server";
import resolveUser from "@/helpers/resolveUser";
import prisma from "../../../../../../../prisma";

export const GET = async (
  request: Request,
  { params }: { params: { address: string; id: string } }
) => {
  try {
    //resolves user
    const user = await resolveUser(params.address);

    const listing = await prisma.listing.findFirst({
      where: {
        uid: params.id,
      },
      include: {
        seller: true,
      },
    });
    return NextResponse.json(listing);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
