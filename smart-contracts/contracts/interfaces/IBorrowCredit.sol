// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Types} from "../libs/Types.sol";

interface IBorrowCredit {
    event CreateCredits(
        address to,
        Types.JSON metadata,
        uint256 credits,
        address[] pools
    );
    event CreditSpent(address pool, address borrower, uint256 credits);
    event CreditReplenished(address pool, address borrower, uint256 credits);
    event IncrementedCredits(address to, uint256 credits);
    event DecrementedCredits(address from, uint256 credits);
    event AddedAccessiblePool(address to, address pool);
    event RemovedAccessiblePool(address to, address pool);

    struct CreditInfo {
        Types.JSON metadata;
        uint256 available;
        uint256 used;
        uint256 updatedAt;
        address[] accessiblePools;
    }

    function spend(address borrower, uint256 amount) external;

    function replenish(address borrower, uint256 amount) external;
}
