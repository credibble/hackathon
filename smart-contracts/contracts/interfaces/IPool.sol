// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

interface IPool {
    function asset() external view returns (address);

    function deposit(uint256 amount) external payable returns (uint256 tokenId);

    function requestWithdraw(uint256 tokenId, uint256 shareAmount) external;

    function cancelWithdraw(uint256 tokenId) external;
}
