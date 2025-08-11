// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

interface IShares {
    function tokenIdOf(address owner) external view returns (uint256);
}
