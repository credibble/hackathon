import hre from "hardhat";
import { Hex, parseEther } from "viem";
import "@nomicfoundation/hardhat-viem";

async function withdraw(pool: Hex, tokenId: bigint, amount: bigint) {
  const poolContract = await hre.viem.getContractAt("Pool", pool);

  await poolContract.write.requestWithdraw([tokenId, amount]);
}

withdraw("0x08eca161d186f2fc81de6af8bd76ed3dbab4fe77", 1n, parseEther("1000"));
