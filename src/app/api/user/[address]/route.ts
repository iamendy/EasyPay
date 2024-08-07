import { NextResponse } from "next/server";
import resolveUser from "../../../../helpers/resolveUser";

export const GET = async (
  request: Request,
  { params }: { params: { address: string } }
) => {
  try {
    //resolves user
    const user = await resolveUser(params.address);
    return NextResponse.json({ user });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
