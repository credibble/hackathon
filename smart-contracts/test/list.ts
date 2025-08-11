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
  "0x4E114B6fda47a713a51AB2688095d67408b138ea",
  "0x88d405e2289ce7bc37434f5e6237d66106f90a7b",
  1n,
  zeroAddress,
  parseEther("50"),
  738784n
);
