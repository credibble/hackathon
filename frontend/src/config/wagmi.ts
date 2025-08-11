import { http, createConfig } from "wagmi";
import { coreTestnet2 } from "viem/chains";

export const config = createConfig({
  chains: [coreTestnet2],
  transports: {
    [coreTestnet2.id]: http(),
  },
});
