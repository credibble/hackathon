// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {IShares} from "../interfaces/IShares.sol";

/**
 * @title Shares NFT Contract
 * @notice base contract for managing share positions as ERC721 NFTs
 * @dev Each NFT represents a user's share deposit position with withdrawal state tracking
 */
contract Shares is ERC721, IShares {
    address public pool;

    /**
     * @dev Counter for incrementing token IDs
     */
    uint256 private _tokenIdCounter = 1;

    /**
     * @dev Maps each address to a single token ID (one share position per address)
     */
    mapping(address => uint256) public ownerToTokenId;

    event AddedShares(
        address owner,
        uint256 tokenId,
        uint256 amount,
        uint256 timestamp
    );
    event RemovedShares(address owner, uint256 tokenId, uint256 amount);
    event ClosedShares(address owner, uint256 tokenId);
    event RevertShares(uint256 tokenId, uint256 lockedAmount);
    event ClaimedShares(uint256 tokenId);

    /**
     * @dev Struct to store details of each share position
     */
    struct SharesInfo {
        uint256 amount; // Active share amount
        uint256 lockedAmount; // Shares pending withdrawal
        uint256 timestamp; // Last deposit/update timestamp
        bool withdrawalRequested; // Flag indicating a withdrawal request is active
        uint256 withdrawRequestTime; // Timestamp when withdrawal was requested
    }

    /**
     * @dev Maps tokenId to its associated SharesInfo
     */
    mapping(uint256 => SharesInfo) public sharesInfo;

    /**
     * @notice Constructor initializes ERC721 with name and symbol
     * @param name Token name
     * @param symbol Token symbol
     */
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        pool = msg.sender;
    }

    /**
     * @notice Adds shares to a user's position or mints a new NFT if none exists
     * @dev Callable only by owner (e.g., pool or protocol manager)
     * @param to Recipient address
     * @param amount Amount of shares to add
     * @return tokenId The token ID associated with the user
     */
    function addShares(
        address to,
        uint256 amount
    ) external onlyPool returns (uint256 tokenId) {
        tokenId = ownerToTokenId[to];

        if (tokenId == 0) {
            // Mint new NFT and initialize share position
            tokenId = _tokenIdCounter++;
            ownerToTokenId[to] = tokenId;

            sharesInfo[tokenId] = SharesInfo({
                amount: amount,
                lockedAmount: 0,
                timestamp: block.timestamp,
                withdrawalRequested: false,
                withdrawRequestTime: 0
            });

            _safeMint(to, tokenId);

            emit AddedShares(to, tokenId, amount, block.timestamp);
        } else {
            // Update existing position
            SharesInfo storage info = sharesInfo[tokenId];

            uint256 weightedTimestamp = Math.mulDiv(
                info.amount,
                info.timestamp,
                info.amount + amount
            ) + Math.mulDiv(amount, block.timestamp, info.amount + amount);

            info.amount += amount;
            info.timestamp = weightedTimestamp;

            emit AddedShares(to, tokenId, amount, weightedTimestamp);
        }
    }

    /**
     * @notice Initiates withdrawal by moving active shares to locked state
     * @param owner Address of the share owner
     * @param amount Amount of shares to withdraw
     */
    function removeShares(address owner, uint256 amount) external onlyPool {
        uint256 tokenId = ownerToTokenId[owner];
        require(tokenId != 0, "Shares: no token assigned");

        SharesInfo storage info = sharesInfo[tokenId];
        require(info.amount >= amount, "Shares: insufficient balance");

        emit RemovedShares(owner, tokenId, amount);

        info.amount -= amount;
        info.lockedAmount += amount;
        info.withdrawalRequested = true;
        info.withdrawRequestTime = block.timestamp;
    }

    /**
     * @notice Cancels a withdrawal request and restores locked shares to active
     * @param tokenId NFT token ID representing the position
     */
    function revertShares(
        uint256 tokenId
    ) external onlyPool returns (uint256 shares) {
        SharesInfo storage info = sharesInfo[tokenId];
        require(info.lockedAmount > 0, "Shares: no locked amount");

        shares = info.lockedAmount;
        emit RevertShares(tokenId, info.lockedAmount);

        info.amount += info.lockedAmount;
        info.lockedAmount = 0;
        info.withdrawalRequested = false;
        info.withdrawRequestTime = 0;
    }

    /**
     * @notice Finalizes the withdrawal by clearing locked shares
     * @param tokenId NFT token ID representing the position
     */
    function claimShares(uint256 tokenId) external onlyPool {
        SharesInfo storage info = sharesInfo[tokenId];
        require(info.lockedAmount > 0, "Shares: no shares to claim");

        emit ClaimedShares(tokenId);

        info.lockedAmount = 0;
        info.timestamp = block.timestamp;
        info.withdrawalRequested = false;
        info.withdrawRequestTime = 0;
    }

    /**
     * @notice Override of transferFrom to add custom logic (e.g., time locks).
     * @dev Prevents transfer if token is still locked.
     * @param from The current owner of the NFT.
     * @param to The address to transfer the NFT to.
     * @param tokenId The ID of the token to transfer.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isAuthorized(from, msg.sender, tokenId),
            "Shares: caller is not owner nor approved"
        );
        require(ownerToTokenId[from] == tokenId, "Shares: invalid token");

        SharesInfo storage info = sharesInfo[tokenId];
        require(!info.withdrawalRequested, "Shares: withdrawal in progress");
        require(to != address(0), "Shares: transfer to zero address");

        uint256 destTokenId = ownerToTokenId[to];
        if (destTokenId == 0) {
            // Mint a new token for the recipient
            uint256 newTokenId = _tokenIdCounter++;
            ownerToTokenId[to] = newTokenId;

            sharesInfo[newTokenId] = SharesInfo({
                amount: info.amount,
                lockedAmount: 0,
                timestamp: block.timestamp,
                withdrawalRequested: false,
                withdrawRequestTime: 0
            });

            _safeMint(to, newTokenId);

            emit AddedShares(to, newTokenId, info.amount, block.timestamp);
        } else {
            // Merge with existing token
            SharesInfo storage destInfo = sharesInfo[destTokenId];

            uint256 weightedTimestamp = Math.mulDiv(
                info.amount,
                info.timestamp,
                destInfo.amount + info.amount
            ) +
                Math.mulDiv(
                    info.amount,
                    block.timestamp,
                    destInfo.amount + info.amount
                );

            destInfo.amount += info.amount;
            destInfo.timestamp = weightedTimestamp;

            emit AddedShares(to, destTokenId, info.amount, weightedTimestamp);
        }

        emit ClosedShares(from, tokenId);

        info.amount = 0;
        info.timestamp = block.timestamp;
        info.withdrawalRequested = false;
        info.withdrawRequestTime = 0;
    }

    /**
     * @notice Returns the shares's  token ID.
     * @param owner Address of the shares.
     * @return tokenId Token ID linked to the shares.
     */
    function getSharesTokenId(
        address owner
    ) public view returns (uint256 tokenId) {
        return ownerToTokenId[owner];
    }

    /**
     * @notice Gets Shares info
     */
    function getInfo(
        uint256 tokenId
    ) external view returns (uint256, uint256, uint256, bool, uint256) {
        SharesInfo memory info = sharesInfo[tokenId];
        return (
            info.amount,
            info.lockedAmount,
            info.timestamp,
            info.withdrawalRequested,
            info.withdrawRequestTime
        );
    }

    /**
     * @notice Modifier to restrict access to pool
     */
    modifier onlyPool() {
        require(pool == msg.sender, "Shares: not pool");
        _;
    }

    /**
     * @notice Modifier to restrict access to NFT holder
     * @param tokenId NFT token ID
     */
    function onlySharesOwner(address owner, uint256 tokenId) external view {
        require(ownerOf(tokenId) == owner, "Shares: not owner");
    }
}
