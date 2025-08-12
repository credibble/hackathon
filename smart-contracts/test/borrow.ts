import hre from "hardhat";
import { Hex, parseUnits } from "viem";
import "@nomicfoundation/hardhat-viem";

async function borrow(pool: Hex, amount: bigint) {
  const poolContract = await hre.viem.getContractAt("Pool", pool);

  await poolContract.write.borrow([amount], {
    account: "0x081E56Ea7935e04Cc8B250D49486162c232091be",
  });
}

borrow("0xf766bbb1d8932fb73ac54f52182c08ad910d186a", parseUnits("100", 6));
