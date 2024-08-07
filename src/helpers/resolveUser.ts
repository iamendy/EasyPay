import { User } from "@prisma/client";
import { isValidAddress } from ".";
import prisma from "../../prisma";

const resolveUser = async (address: string) => {
  let user: User | null;

  //checks valid address
  if (!isValidAddress(address)) {
    throw new Error("Invalid address");
  }

  user = await prisma.user.findFirst({
    where: {
      address,
    },
  });

  if (user) {
    return user;
  }

  user = await prisma.user.create({
    data: {
      address,
    },
  });

  return user;
};

export default resolveUser;
