import hre from "hardhat";
import { Hex } from "viem";
import "@nomicfoundation/hardhat-viem";

async function addAccessiblePool(credit: Hex, borrower: Hex, pools: Hex[]) {
  const borrowCredit = await hre.viem.getContractAt("BorrowCredit", credit);

  for (const pool of pools) {
    const hash = await borrowCredit.write.addAccessiblePool([borrower, pool]);
    console.log(`Added ${pool} of ${borrower} in ${hash}`);
  }
}

addAccessiblePool(
  "0x9a2f9b67e31f90dcf2b1bf8458220da1b4568c5b",
  "0xf9210606957C32E5add4580aa6b56b9CDD2C766f",
  [
    "0x82e7643c9d8c701a5b7b49a57b93fbc13ea26c6b",
    "0xd92b95b45e4f0301ea0170b833dba21de3e74574",
    "0xf766bbb1d8932fb73ac54f52182c08ad910d186a",
  ]
);

addAccessiblePool(
  "0x9a2f9b67e31f90dcf2b1bf8458220da1b4568c5b",
  "0x081E56Ea7935e04Cc8B250D49486162c232091be",
  [
    "0x82e7643c9d8c701a5b7b49a57b93fbc13ea26c6b",
    "0xd334c474b7f5c2dd3cd5de75858229ba8ba87196",
    "0xf766bbb1d8932fb73ac54f52182c08ad910d186a",
  ]
);

addAccessiblePool(
  "0x9a2f9b67e31f90dcf2b1bf8458220da1b4568c5b",
  "0x3E646e062F05e01e1860eA53a6DC81e7E9162DE6",
  [
    "0xbc98a70b7a3d7f3db1493f686d759b9c812dff2e",
    "0xd334c474b7f5c2dd3cd5de75858229ba8ba87196",
    "0xf766bbb1d8932fb73ac54f52182c08ad910d186a",
  ]
);
