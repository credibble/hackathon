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
  "0xb4b9156de6dcd0d3cfdcb4f6d17ac513e2109fd3",
  "0xde76dad8f3ff254a738564deca16f2d11fc0f681",
  1n,
  zeroAddress,
  parseEther("50"),
  7n * 86400n
);
