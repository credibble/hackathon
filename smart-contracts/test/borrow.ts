import { network } from "hardhat";

async function borrow(pool: string, amount: bigint) {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const poolContract = await ethers.getContractAt("Pool", pool);

  await poolContract.borrow(amount, {
    from: "0x081E56Ea7935e04Cc8B250D49486162c232091be",
  });
}

// borrow(
//   "0xf766bbb1d8932fb73ac54f52182c08ad910d186a",
//   ethers.parseUnits("100", 6)
// );
