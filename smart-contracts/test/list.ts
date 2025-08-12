import hre from "hardhat";
import "@nomicfoundation/hardhat-viem";
import { Hex, parseEther, zeroAddress } from "viem";

async function listShares(
  market: Hex,
  shares: Hex,
  tokenId: bigint,
  paymentToken: Hex,
  price: bigint,
  expiresIn: bigint
) {
  const shareContract = await hre.viem.getContractAt("Shares", shares);
  const marketPlace = await hre.viem.getContractAt("MarketPlace", market);

  await shareContract.write.approve([market, tokenId]);

  await marketPlace.write.list([
    shares,
    tokenId,
    paymentToken,
    price,
    expiresIn,
  ]);
}

listShares(
  "0xd55654e62f6a839619a50c5f333b80e573ff2d36",
  "0x88d405e2289ce7bc37434f5e6237d66106f90a7b",
  1n,
  zeroAddress,
  parseEther("50"),
  738784n
);
