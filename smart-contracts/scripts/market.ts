import hre from "hardhat";
import { Hex } from "viem";
import "@nomicfoundation/hardhat-viem";

async function whiteListShares(market: Hex, shares: Hex[]) {
  const marketPlace = await hre.viem.getContractAt("MarketPlace", market);

  for (const share of shares) {
    const hash = await marketPlace.write.addAllowed([share]);
    console.log(`Added ${share} in ${hash}`);
  }
}

whiteListShares("0x4E114B6fda47a713a51AB2688095d67408b138ea", [
  "0x88d405e2289ce7bc37434f5e6237d66106f90a7b",
  "0x5953cd1d4f58400385a0371fbaf11055f2a13431",
  "0xae8d96e8e1309f2cabed254cdc542349aae4380b",
  "0x9bf5334f6178fdaa33e2e6c0b69356ce7d04e0c1",
  "0xde7710663d061f1b68b7dd496f61f62a124a340b",
]);
