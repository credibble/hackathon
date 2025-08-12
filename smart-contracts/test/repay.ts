import hre from "hardhat";
import { Hex, parseEther, parseUnits } from "viem";
import "@nomicfoundation/hardhat-viem";

async function withdraw(pool: Hex, tokenId: bigint, amount: bigint) {
  const poolContract = await hre.viem.getContractAt("Pool", pool);

  const token = await poolContract.read.asset();

  const tokenContract = await hre.viem.getContractAt("ERC20", token);

  await tokenContract.write.approve([pool, amount]);

  await poolContract.write.repay([tokenId, amount]);
}

withdraw(
  "0x0cd217733be749b18c9c59a7ce4b93df81ae7824",
  1n,
  parseUnits("100", 6)
);
