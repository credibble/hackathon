// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {IBorrowCredit} from "./interfaces/IBorrowCredit.sol";
import {PoolHelper} from "./libs/PoolHelper.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Shares} from "./core/Shares.sol";
import {IShares} from "./interfaces/IShares.sol";
import {Position} from "./core/Position.sol";
import {IPosition} from "./interfaces/IPosition.sol";

/**
 * @title Pool Contract
 * @dev Manages deposits, withdrawals, borrowing, and lending of assets.
 *      Implements a liquidity pool with shares and positions.
 */
contract Pool is ReentrancyGuard, Ownable, Pausable, PoolHelper {
    using Math for uint256;

    address public immutable asset; // address(0) = native coin

    uint256 public totalShares;
    uint256 public totalTVL;
    uint256 public totalBorrowed;

    uint256 public lockPeriod;
    uint256 public withdrawDelay;
    uint256 public borrowAPY;
    uint256 public constant YEAR = 365 days;

    IShares public sharesToken;
    IPosition public positionToken;

    uint256 public constant INITIAL_LP = 1_000 * 1e18;

    IBorrowCredit public credit;

    struct Config {
        string symbol;
        address asset; // address(0) means native coin
        address credit;
        uint256 lockPeriod;
        uint256 withdrawDelay;
        uint256 borrowAPY;
    }

    event NativeTransferFailed(address to, uint256 amount);

    constructor(
        Config memory _config,
        address comptroller
    ) Ownable(comptroller) {
        asset = _config.asset; // allow address(0) for native
        lockPeriod = _config.lockPeriod;
        withdrawDelay = _config.withdrawDelay;
        borrowAPY = _config.borrowAPY;
        sharesToken = new Shares("Credibble LP Shares", _config.symbol);
        positionToken = new Position(
            "Credibble Borrow Positions",
            _config.symbol
        );
        credit = IBorrowCredit(_config.credit);

        emit InitializedPool(address(sharesToken), address(positionToken));
    }

    /**
     * @notice Deposit tokens/native coin and mint proportional LP shares.
     * @param amount Token amount to deposit (ignored if native)
     */
    function deposit(
        uint256 amount
    ) external payable nonReentrant whenNotPaused returns (uint256 tokenId) {
        uint256 depositAmount = _isNative() ? msg.value : amount;
        require(depositAmount > 0, "Amount = 0");

        uint256 shares;
        if (totalShares == 0 || totalTVL == 0) {
            shares = INITIAL_LP;
        } else {
            shares = depositAmount.mulDiv(totalShares, totalTVL);
        }

        if (_isNative()) {
            require(msg.value == depositAmount, "Invalid msg.value");
        } else {
            IERC20(asset).transferFrom(
                msg.sender,
                address(this),
                depositAmount
            );
        }

        tokenId = sharesToken.addShares(msg.sender, shares);

        totalShares += shares;
        totalTVL += depositAmount;

        emit DepositedPool(msg.sender, depositAmount, shares, tokenId);
    }

    /**
     * @notice Request to withdraw shares, moving them to locked state.
     * @param tokenId NFT token ID representing the shares position
     * @param shareAmount Amount of shares to withdraw
     */
    function requestWithdraw(
        uint256 tokenId,
        uint256 shareAmount
    ) external whenNotPaused {
        sharesToken.onlySharesOwner(msg.sender, tokenId);

        sharesToken.removeShares(msg.sender, shareAmount);
        totalShares -= shareAmount;

        emit RequestedWithdrawPool(msg.sender, tokenId, shareAmount);
    }

    /**
     * @notice Cancel a withdrawal request and restore locked shares to active.
     * @param tokenId NFT token ID representing the shares position
     */
    function cancelWithdraw(uint256 tokenId) external whenNotPaused {
        sharesToken.onlySharesOwner(msg.sender, tokenId);

        uint256 shares = sharesToken.revertShares(tokenId);
        totalShares += shares;

        emit WithdrawCancelledPool(msg.sender, tokenId, shares);
    }

    /**
     * @notice Claim shares after withdrawal delay and lock period.
     * @param tokenId NFT token ID representing the shares position
     */
    function claimWithdraw(
        uint256 tokenId
    ) external nonReentrant whenNotPaused {
        sharesToken.onlySharesOwner(msg.sender, tokenId);

        (
            ,
            uint256 lockedAmount,
            uint256 timestamp,
            bool withdrawalRequested,
            uint256 withdrawRequestTime
        ) = sharesToken.getInfo(tokenId);
        require(withdrawalRequested, "No withdrawal requested");
        require(
            block.timestamp >= withdrawRequestTime + withdrawDelay,
            "Withdrawal delay not met"
        );

        uint256 amountOut = lockedAmount;
        if (block.timestamp >= timestamp + lockPeriod) {
            amountOut = lockedAmount.mulDiv(totalTVL, totalShares);
            if (amountOut < lockedAmount) {
                amountOut = lockedAmount;
            }
        }

        require(amountOut <= availableLiquidity(), "Not enough liquidity");

        sharesToken.claimShares(tokenId);
        totalTVL -= amountOut;

        if (_isNative()) {
            (bool success, ) = msg.sender.call{value: amountOut}("");
            if (!success) emit NativeTransferFailed(msg.sender, amountOut);
        } else {
            IERC20(asset).transfer(msg.sender, amountOut);
        }

        emit ClaimedWithdrawPool(msg.sender, tokenId, amountOut);
    }

    /**
     * @notice Borrow tokens from the pool.
     * @param amount Amount to borrow
     * @return tokenId Token ID of the borrower's position
     */
    function borrow(
        uint256 amount
    ) external whenNotPaused returns (uint256 tokenId) {
        credit.spend(msg.sender, amount);

        require(amount > 0, "Amount = 0");
        require(amount <= availableLiquidity(), "Exceeds liquidity");

        uint256 __dueAmount;
        uint256 __tokenId = positionToken.getPositionTokenId(msg.sender);
        if (__tokenId != 0) {
            (uint256 __amount, , uint256 __timestamp) = positionToken.getInfo(
                __tokenId
            );
            __dueAmount = _calculateInterest(__amount, __timestamp);
        }

        if (_isNative()) {
            (bool success, ) = msg.sender.call{value: amount}("");
            if (!success) emit NativeTransferFailed(msg.sender, amount);
        } else {
            IERC20(asset).transfer(msg.sender, amount);
        }

        tokenId = positionToken.incrementPosition(
            msg.sender,
            amount,
            __dueAmount
        );

        totalBorrowed += amount;

        emit BorrowedPool(msg.sender, tokenId, amount, __dueAmount);
    }

    /**
     * @notice Repay borrowed amount.
     * @param tokenId Token ID of the borrower's position
     * @param amount Amount to repay (if native, msg.value is used)
     */
    function repay(
        uint256 tokenId,
        uint256 amount
    ) external payable nonReentrant whenNotPaused {
        _repay(tokenId, amount);
    }

    function repayAll(uint256 tokenId) external payable whenNotPaused {
        (uint256 positionPrincipal, , uint256 since) = positionToken.getInfo(
            tokenId
        );
        uint256 interest = _calculateInterest(positionPrincipal, since);
        uint256 principalToApply = positionPrincipal > totalBorrowed
            ? totalBorrowed
            : positionPrincipal;

        uint256 totalDue = principalToApply + interest;

        _repay(tokenId, totalDue);
    }

    function _repay(uint256 tokenId, uint256 amount) internal {
        uint256 repayPrincipal = _isNative() ? msg.value : amount;
        require(repayPrincipal > 0, "Amount = 0");

        (uint256 positionPrincipal, , uint256 since) = positionToken.getInfo(
            tokenId
        );
        uint256 interest = _calculateInterest(positionPrincipal, since);

        uint256 principalToApply = repayPrincipal > totalBorrowed
            ? totalBorrowed
            : repayPrincipal;
        uint256 totalDue = principalToApply + interest;
        if (_isNative()) {
            require(msg.value >= totalDue, "Insufficient native payment");
            uint256 refund = msg.value - totalDue;
            if (refund > 0) {
                (bool ok, ) = msg.sender.call{value: refund}("");
                require(ok, "refund failed");
            }
        } else {
            IERC20(asset).transferFrom(msg.sender, address(this), totalDue);
        }

        positionToken.decrementPosition(tokenId, principalToApply);
        totalBorrowed -= principalToApply;
        totalTVL += interest;
        credit.replenish(msg.sender, principalToApply);

        emit RepaidPool(msg.sender, tokenId, principalToApply, interest);
    }

    /**
     * @notice Returns the available liquidity in the pool.
     * @return Available liquidity
     */
    function availableLiquidity() public view returns (uint256) {
        return totalTVL - totalBorrowed;
    }

    /**
     * @notice Calculates the interest for a given amount and time.
     * @param amount Amount to calculate interest for
     * @param since Timestamp when the amount was borrowed
     * @return Calculated interest
     */
    function _calculateInterest(
        uint256 amount,
        uint256 since
    ) internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - since;
        uint256 interest = Math.mulDiv(amount, borrowAPY, 10_000);
        return Math.mulDiv(interest, timeElapsed, YEAR);
    }

    /**
     * @notice Checks if the pool uses native coin (address(0)).
     * @return True if native, false if ERC20 token
     */
    function _isNative() internal view returns (bool) {
        return asset == address(0);
    }

    receive() external payable {}

    /**
     * @notice Pause the pool.
     * @dev Only callable by the contract owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the pool.
     * @dev Only callable by the contract owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
