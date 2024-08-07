import prisma from "../../prisma";

async function getUniqueId(length: number = 4): Promise<string> {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  // Keep generating until a unique string is found
  while (await databaseCheck(result)) {
    getUniqueId();
  }

  return result;
}

async function databaseCheck(string: string): Promise<boolean> {
  const listing = await prisma.listing.findFirst({ where: { uid: string } });
  console.log(listing);
  return !!listing;
}

export default getUniqueId;
