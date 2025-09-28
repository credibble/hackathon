import { network } from "hardhat";

async function withdraw(pool: string, tokenId: bigint, amount: bigint) {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const poolContract = await ethers.getContractAt("Pool", pool);

  const token = await poolContract.asset();

  const tokenContract = await ethers.getContractAt("ERC20", token);

  await tokenContract.approve(pool, amount);

  await poolContract.repay(tokenId, amount);
}

// withdraw(
//   "0x0cd217733be749b18c9c59a7ce4b93df81ae7824",
//   1n,
//   ethers.parseUnits("100", 6)
// );
