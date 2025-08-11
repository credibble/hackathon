// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketPlaceModule = buildModule("MarketPlaceModule", (m) => {
  const marketplace = m.contract("MarketPlace");

  //   m.call(marketplace, "addAllowed", []);

  return { marketplace };
});

export default MarketPlaceModule;
