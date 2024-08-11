import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { optimism, optimismSepolia } from "wagmi/chains";
import { fallback, http } from "wagmi";
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

export const config = getDefaultConfig({
  appName: "EasyPay - easy links, fast payment!",
  projectId: projectId,
  chains: [optimism, optimismSepolia],
  ssr: true,
  transports: {
    [optimismSepolia.id]: fallback([
      http("https://optimism-sepolia.blockscout.com"), // blockscout fallback integration
    ]),
  },
});
