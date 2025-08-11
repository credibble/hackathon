// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {Pool} from "./Pool.sol";
import {Types} from "./libs/Types.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PoolFactory is Ownable {
    event CreatedPool(
        address indexed pool,
        string name,
        string description,
        string symbol,
        Types.JSON documents,
        Types.RichText terms,
        address asset,
        address credit,
        uint256 lockPeriod,
        uint256 withdrawDelay,
        uint256 borrowAPY
    );

    constructor() Ownable(msg.sender) {}

    function create(
        string memory name,
        string memory description,
        Types.JSON memory documents,
        Types.RichText memory terms,
        Pool.Config memory config
    ) external onlyOwner returns (address pool) {
        pool = address(new Pool(config, msg.sender));

        emit CreatedPool(
            pool,
            name,
            description,
            config.symbol,
            documents,
            terms,
            config.asset,
            config.credit,
            config.lockPeriod,
            config.withdrawDelay,
            config.borrowAPY
        );
    }
}
