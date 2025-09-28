import { network } from "hardhat";

async function whiteListPools(credit: string, pools: string[]) {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const borrowCredit = await ethers.getContractAt("BorrowCredit", credit);

  for (const pool of pools) {
    const hash = await borrowCredit.addToWhitelist(pool);
    console.log(`Added ${pool} in ${hash}`);
  }
}

whiteListPools("0x9a2f9b67e31f90dcf2b1bf8458220da1b4568c5b", [
  "0x82e7643c9d8c701a5b7b49a57b93fbc13ea26c6b",
  "0xbc98a70b7a3d7f3db1493f686d759b9c812dff2e",
  "0xd334c474b7f5c2dd3cd5de75858229ba8ba87196",
  "0xd92b95b45e4f0301ea0170b833dba21de3e74574",
  "0xf766bbb1d8932fb73ac54f52182c08ad910d186a",
]);
