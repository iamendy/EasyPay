import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { optimism, optimismSepolia } from "wagmi/chains";
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

export const config = getDefaultConfig({
  appName: "EasyPay - easy links, fast payment!",
  projectId: projectId,
  chains: [optimism, optimismSepolia],
  ssr: true,
});
