// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IPool {
    function asset() external view returns (address);

    function totalShares() external view returns (uint256);

    function totalTVL() external view returns (uint256);

    function totalBorrowed() external view returns (uint256);

    function lockPeriod() external view returns (uint256);

    function withdrawDelay() external view returns (uint256);

    function borrowAPY() external view returns (uint256);

    function deposit(uint256 amount) external payable returns (uint256 tokenId);

    function requestWithdraw(uint256 tokenId, uint256 shareAmount) external;

    function cancelWithdraw(uint256 tokenId) external;

    function borrow(uint256 amount) external returns (uint256 tokenId);

    function repay(uint256 tokenId, uint256 amount) external payable;

    function repayAll(uint256 tokenId) external payable;

    function availableLiquidity() external view returns (uint256);
}
