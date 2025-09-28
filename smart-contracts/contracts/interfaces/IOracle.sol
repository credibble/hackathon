// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IOracle {
    event CreditToAssetSet(address asset, uint256 credit);

    function getCredits(
        address asset,
        uint256 amount
    ) external view returns (uint256);
}
