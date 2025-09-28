// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IShares {
    function addShares(
        address to,
        uint256 amount
    ) external returns (uint256 tokenId);

    function removeShares(address owner, uint256 amount) external;

    function revertShares(uint256 tokenId) external returns (uint256 shares);

    function claimShares(uint256 tokenId) external;

    function getSharesTokenId(
        address owner
    ) external view returns (uint256 tokenId);

    function getInfo(
        uint256 tokenId
    )
        external
        view
        returns (
            uint256 amount,
            uint256 lockedAmount,
            uint256 timestamp,
            bool withdrawalRequested,
            uint256 withdrawRequestTime
        );

    function onlySharesOwner(address owner, uint256 tokenId) external view;
}
