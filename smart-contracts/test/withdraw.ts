import { network } from "hardhat";

async function withdraw(pool: string, tokenId: bigint, amount: bigint) {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const poolContract = await ethers.getContractAt("Pool", pool);

  await poolContract.requestWithdraw(tokenId, amount);
}

// withdraw(
//   "0x08eca161d186f2fc81de6af8bd76ed3dbab4fe77",
//   1n,
//   ethers.parseEther("1000")
// );
