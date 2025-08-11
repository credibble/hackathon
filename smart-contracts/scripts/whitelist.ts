import hre from "hardhat";
import { Hex } from "viem";
import "@nomicfoundation/hardhat-viem";

async function whiteListPools(credit: Hex, pools: Hex[]) {
  const borrowCredit = await hre.viem.getContractAt("BorrowCredit", credit);

  for (const pool of pools) {
    const hash = await borrowCredit.write.addToWhitelist([pool]);
    console.log(`Added ${pool} in ${hash}`);
  }
}

whiteListPools("0xe3d877e22c84a8c1a673423f2d18b122a44cc6cd", [
  "0x0cd217733be749b18c9c59a7ce4b93df81ae7824",
  "0x2223672449abd003cb0aa63fe2307b55543ad915",
  "0x9faeeb1db1ef69f788decd19758cc064ea372861",
  "0xf56fb6dd6972688065c6610ecef78401eddad6f3",
  "0xfba8bf136e75b7a7e139dc6fb5148786cdb08b94",
]);
