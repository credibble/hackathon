import { http, createConfig } from "wagmi";
import { hederaTestnet } from "viem/chains";

export const config = createConfig({
  chains: [hederaTestnet],
  transports: {
    [hederaTestnet.id]: http(),
  },
});
