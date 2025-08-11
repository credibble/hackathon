import { vars, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const MNEMONIC = vars.get("MNEMONIC_2");
const CORE_TESTNET_2_API_KEY = vars.get("CORE_TESTNET_2_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          evmVersion: "shanghai",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 20000,
  },
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey:
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          balance: "10000000000000000000000",
        },
      ],
    },
    coreTestnet2: {
      url: "https://rpc.test2.btcs.network",
      chainId: 1114,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  etherscan: {
    apiKey: {
      coreTestnet2: CORE_TESTNET_2_API_KEY,
    },
    customChains: [
      {
        network: "coreTestnet2",
        chainId: 1114,
        urls: {
          apiURL: "https://api.test2.btcs.network/api",
          browserURL: "https://scan.test2.btcs.network/",
        },
      },
    ],
  },
};

export default config;
