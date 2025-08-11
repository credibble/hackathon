// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IOracle} from "../interfaces/IOracle.sol";

/**
 * @title Oracle
 * @notice This contract manages credit-to-asset conversion rates for supported ERC20 tokens.
 * @dev Only the owner can set or update conversion rates. Designed to be used as a data source in loan-related logic.
 */
contract Oracle is IOracle, Ownable {
    using Math for uint256;

    /**
     * @notice Mapping of ERC20 asset address to credit multiplier.
     * @dev Represents how many credit units 1 unit of the asset is worth.
     * Example: if USDT => 100, then 1 USDT = 100 credits.
     */
    mapping(address => uint256) public creditToAsset;

    /**
     * @notice Initializes the contract and sets the owner.
     * @dev Inherits the Ownable constructor which accepts the initial owner.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Returns the credit value of a given amount of an asset.
     * @param asset The token address.
     * @param amount The amount of tokens to convert.
     * @return The equivalent amount in credits.
     * @dev Multiplies the token amount by the credit rate set for the token.
     */
    function getCredits(
        address asset,
        uint256 amount
    ) external view returns (uint256) {
        return creditToAsset[asset].mulDiv(amount, 1 ether);
    }

    /**
     * @notice Sets the credit conversion rate for a specific asset.
     * @dev Only callable by the contract owner.
     * @param asset The token address.
     * @param ratio The number of credits that 1 unit of the asset should be worth.
     * Emits a {CreditToAssetSet} event.
     */
    function setCreditToAsset(address asset, uint256 ratio) external onlyOwner {
        creditToAsset[asset] = ratio;
        emit CreditToAssetSet(asset, ratio);
    }
}
