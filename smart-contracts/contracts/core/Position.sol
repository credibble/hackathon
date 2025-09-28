// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IPosition} from "../interfaces/IPosition.sol";

/**
 * @title Position
 * @notice ERC721 contract representing borrower positions as NFTs.
 *         Each borrower is associated with one tokenized position that is updated
 *         on additional borrow events. Repayments adjust the outstanding due amount.
 */
contract Position is ERC721, IPosition {
    address public pool;

    /// @dev Internal counter for generating unique token IDs.
    uint256 private _tokenIdCounter;

    /// @notice Struct representing a borrower's current borrow state.
    struct BorrowInfo {
        uint256 amount; // Principal borrowed (without interest)
        uint256 dueAmount; // Total due (principal + interest)
        uint256 timestamp; // Last updated timestamp
    }

    /// @notice Mapping from tokenId to associated borrow information.
    mapping(uint256 => BorrowInfo) public borrowInfo;

    /// @notice Mapping from borrower address to their NFT tokenId.
    mapping(address => uint256) public borrowerToTokenId;

    event IncrementPosition(
        address indexed position,
        address borrower,
        uint256 tokenId,
        uint256 amount,
        uint256 dueAmount
    );

    event DecrementPosition(
        address indexed position,
        uint256 tokenId,
        uint256 repayAmount
    );

    /**
     * @dev Initializes the ERC721 token with a name and symbol.
     * @param name Token name (e.g. "Credibble Borrow Position").
     * @param symbol Token symbol (e.g. "CBP").
     */
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        pool = msg.sender;
    }

    /**
     * @notice Creates or updates a borrower position.
     * @dev If the borrower already owns a position, the borrow and due amounts are updated.
     * @param borrower Address of the borrower.
     * @param amount New principal amount to add.
     * @param dueAmount New due amount (including interest) to add.
     * @return tokenId The borrower's current or newly created tokenId.
     */
    function incrementPosition(
        address borrower,
        uint256 amount,
        uint256 dueAmount
    ) external onlyPool returns (uint256 tokenId) {
        tokenId = borrowerToTokenId[borrower];

        if (tokenId == 0) {
            // Mint new NFT for borrower
            tokenId = ++_tokenIdCounter;
            borrowerToTokenId[borrower] = tokenId;

            borrowInfo[tokenId] = BorrowInfo({
                amount: amount,
                dueAmount: dueAmount,
                timestamp: block.timestamp
            });

            _safeMint(borrower, tokenId);
        } else {
            // Update existing borrow info
            BorrowInfo storage info = borrowInfo[tokenId];
            info.amount += amount;
            info.dueAmount += dueAmount;
            info.timestamp = block.timestamp;
        }

        emit IncrementPosition(
            address(this),
            borrower,
            tokenId,
            amount,
            dueAmount
        );
    }

    /**
     * @notice Reduces the borrower's due amount on repayment.
     * @dev If full repayment is made, the principal is cleared.
     * @param tokenId Borrow NFT tokenId
     * @param repayAmount Amount being repaid.
     */
    function decrementPosition(
        uint256 tokenId,
        uint256 repayAmount
    ) external onlyPool {
        require(tokenId != 0, "Position: no active position");

        BorrowInfo storage info = borrowInfo[tokenId];

        if (info.dueAmount >= repayAmount) {
            info.dueAmount -= repayAmount;
        } else {
            info.amount -= (repayAmount - info.dueAmount);
            info.dueAmount = 0;
        }

        info.timestamp = block.timestamp;

        emit DecrementPosition(address(this), tokenId, repayAmount);
    }

    /**
     * @notice Returns the borrower's position token ID.
     * @param borrower Address of the borrower.
     * @return tokenId Token ID linked to the borrower.
     */
    function getPositionTokenId(
        address borrower
    ) public view returns (uint256) {
        return borrowerToTokenId[borrower];
    }

    /**
     * @notice Gets Position info
     */
    function getInfo(
        uint256 tokenId
    ) external view returns (uint256, uint256, uint256) {
        BorrowInfo memory info = borrowInfo[tokenId];
        return (info.amount, info.dueAmount, info.timestamp);
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
        revert("BorrowNFT: transfers are disabled");
    }

    /**
     * @notice Modifier to restrict access to pool
     */
    modifier onlyPool() {
        require(pool == msg.sender, "Position: not pool");
        _;
    }

    /**
     * @dev Restricts access to the position owner (borrower).
     * @param tokenId ID of the position token.
     */
    function onlyPositionOwner(address owner, uint256 tokenId) external view {
        require(
            ownerOf(tokenId) == owner,
            "Position: caller is not token owner"
        );
    }
}
