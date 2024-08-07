import { createConfig, http } from "wagmi";
import { celo } from "wagmi/chains";
import { injected } from "wagmi/connectors";
const apiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY as string;

export const config = createConfig({
  chains: [celo],
  connectors: [injected()],
  transports: {
    //@ts-ignore
    [celo.id]: http(`https://celo-mainnet.infura.io/v3/${apiKey}`),
  },
});
