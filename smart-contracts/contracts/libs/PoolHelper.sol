// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

interface PoolHelper {
    event InitializedPool(address sharesToken, address positionToken);

    event DepositedPool(
        address indexed owner,
        uint256 amount,
        uint256 shares,
        uint256 tokenId
    );

    event ClaimedWithdrawPool(
        address indexed owner,
        uint256 tokenId,
        uint256 amountOut
    );

    event BorrowedPool(
        address indexed borrower,
        uint256 tokenId,
        uint256 amount,
        uint256 dueAmount
    );

    event RepaidPool(
        address indexed repayer,
        uint256 tokenId,
        uint256 amount,
        uint256 interest
    );

    event RequestedWithdrawPool(
        address indexed owner,
        uint256 tokenId,
        uint256 shares
    );

    event WithdrawCancelledPool(
        address indexed owner,
        uint256 tokenId,
        uint256 shares
    );

    event SetBorrowApy(uint256 borrowAPY);

    event SetWithdrawDelay(uint256 withdrawDelay);

    event SetLockPeriod(uint256 lockPeriod);
}
