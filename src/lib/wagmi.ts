import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

export const config = getDefaultConfig({
  appName: "EasyPay - easy links, fast payment!",
  projectId: projectId,
  chains: [arbitrum, arbitrumSepolia],
  ssr: true,
});
