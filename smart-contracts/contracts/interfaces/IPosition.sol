// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IPosition {
    function incrementPosition(
        address borrower,
        uint256 amount,
        uint256 dueAmount
    ) external returns (uint256 tokenId);

    function decrementPosition(uint256 tokenId, uint256 repayAmount) external;

    function getPositionTokenId(
        address borrower
    ) external view returns (uint256 tokenId);

    function getInfo(
        uint256 tokenId
    )
        external
        view
        returns (uint256 amount, uint256 dueAmount, uint256 timestamp);

    function onlyPositionOwner(address owner, uint256 tokenId) external view;
}
