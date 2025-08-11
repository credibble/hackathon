// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFT Vault Contract
 * @dev Stores a single NFT for a specific listing
 */
contract Vault is Ownable {
    address public immutable shares;
    uint256 public immutable tokenId;

    constructor(address _shares, uint256 _tokenId) Ownable(msg.sender) {
        shares = _shares;
        tokenId = _tokenId;
    }

    /**
     * @notice Transfers the stored NFT to a recipient (only callable by owner)
     */
    function transferTo(address recipient) external onlyOwner {
        IERC721(shares).transferFrom(address(this), recipient, tokenId);
    }
}
