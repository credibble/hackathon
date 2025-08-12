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

whiteListShares("0xd55654e62f6a839619a50c5f333b80e573ff2d36", [
  "0x3c79877a788db228332bcca268f6d0e00b993a97",
  "0xc57cf8960678bb6c1e55dd47cbec590b4b64b8b6",
  "0xf042a6174ae9405b420c309e5564e913266c586f",
  "0xec4de96c4ce06ce3e43cfd2a98774a150f48eb40",
  "0xde76dad8f3ff254a738564deca16f2d11fc0f681",
]);
