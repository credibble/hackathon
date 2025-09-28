import { network } from "hardhat";

async function listShares(
  market: string,
  shares: string,
  tokenId: bigint,
  paymentToken: string,
  price: bigint,
  expiresIn: bigint
) {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const shareContract = await ethers.getContractAt("Shares", shares);
  const marketPlace = await ethers.getContractAt("MarketPlace", market);

  await shareContract.approve(market, tokenId);

  await marketPlace.list(shares, tokenId, paymentToken, price, expiresIn);
}

// listShares(
//   "0xb4b9156de6dcd0d3cfdcb4f6d17ac513e2109fd3",
//   "0xde76dad8f3ff254a738564deca16f2d11fc0f681",
//   1n,
//   ethers.ZeroAddress,
//   ethers.parseEther("50"),
//   7n * 86400n
// );
