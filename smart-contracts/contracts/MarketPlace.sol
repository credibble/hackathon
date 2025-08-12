// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Shares} from "./core/Shares.sol";
import {Vault} from "./core/Vault.sol";

/**
 * @title Shares Marketplace Contract
 * @dev Deploys per-listing vaults to hold Shares NFTs and manage sales
 */
contract MarketPlace is Ownable {
    struct Listing {
        address vault;
        address seller;
        address shares;
        uint256 tokenId;
        address paymentToken; // address(0) = native coin
        uint256 price;
        uint256 expiresIn;
    }

    mapping(address => bool) public allowedShares;
    Listing[] public listings;

    event Listed(
        uint256 indexed id,
        address indexed seller,
        address shares,
        address paymentToken,
        uint256 price,
        uint256 expiresIn,
        address vault,
        uint256 vaultTokenId
    );
    event Purchased(uint256 indexed id, address indexed buyer);
    event Delisted(uint256 indexed id);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Add allowed NFT contract for listing
     */
    function addAllowed(address _shares) external onlyOwner {
        allowedShares[_shares] = true;
    }

    /**
     * @notice List an NFT by deploying a vault
     */
    function list(
        address _shares,
        uint256 _tokenId,
        address _paymentToken,
        uint256 _price,
        uint256 _expiresIn
    ) external {
        require(allowedShares[_shares], "NFT not allowed");

        address vault = address(new Vault(_shares, _tokenId));

        Shares(_shares).transferFrom(msg.sender, vault, _tokenId);
        uint256 vaultTokenId = Shares(_shares).ownerToTokenId(vault);

        listings.push(
            Listing({
                vault: vault,
                seller: msg.sender,
                shares: _shares,
                tokenId: _tokenId,
                paymentToken: _paymentToken,
                price: _price,
                expiresIn: block.timestamp + _expiresIn
            })
        );

        emit Listed(
            listings.length - 1,
            msg.sender,
            _shares,
            _paymentToken,
            _price,
            block.timestamp + _expiresIn,
            vault,
            vaultTokenId
        );
    }

    /**
     * @notice Cancel a listing and retrieve NFT
     */
    function delist(uint256 _id) external {
        Listing storage listing = listings[_id];
        require(msg.sender == listing.seller, "Not seller");

        Vault(listing.vault).transferTo(listing.seller);

        delete listings[_id];

        emit Delisted(_id);
    }

    /**
     * @notice Purchase a listed NFT
     */
    function purchase(uint256 _id) external payable {
        Listing storage listing = listings[_id];
        require(block.timestamp < listing.expiresIn, "Listing expired");

        if (listing.paymentToken == address(0)) {
            require(msg.value == listing.price, "Incorrect native amount");
            payable(listing.seller).transfer(listing.price);
        } else {
            IERC20(listing.paymentToken).transferFrom(
                msg.sender,
                listing.seller,
                listing.price
            );
        }

        Vault(listing.vault).transferTo(msg.sender);

        delete listings[_id];

        emit Purchased(_id, msg.sender);
    }

    /**
     * @notice View listing count
     */
    function totalListings() external view returns (uint256) {
        return listings.length;
    }
}
