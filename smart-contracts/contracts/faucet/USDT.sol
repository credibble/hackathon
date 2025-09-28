// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    uint256 public constant MAX_MINT_AMOUNT = 1_000 * 10 ** 2;

    constructor() ERC20("Tether USD", "USDT") {}

    function faucet(address to, uint256 amount) external {
        require(amount <= MAX_MINT_AMOUNT, "Exceeds max mint amount");
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
