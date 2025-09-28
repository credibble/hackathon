// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IShares} from "../interfaces/IShares.sol";

/**
 * @title NFT Vault Contract
 * @dev Stores a single NFT for a specific listing
 */
contract Vault is Ownable, IERC721Receiver {
    address public immutable shares;

    constructor(address _shares) Ownable(msg.sender) {
        shares = _shares;
    }

    /**
     * @notice Transfers the stored NFT to a recipient (only callable by owner)
     */
    function transferTo(address recipient) external onlyOwner {
        uint256 tokenId = IShares(shares).getSharesTokenId(address(this));
        IERC721(shares).transferFrom(address(this), recipient, tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
