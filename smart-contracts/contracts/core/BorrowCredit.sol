// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPool} from "../interfaces/IPool.sol";
import {IOracle} from "../interfaces/IOracle.sol";
import {IBorrowCredit} from "../interfaces/IBorrowCredit.sol";
import {Types} from "../libs/Types.sol";

/**
 * @title BorrowCredit
 * @notice This contract manages credit allocation and usage for borrowers.
 * @dev Only whitelisted contracts (pools) can call `spend` and `replenish`.
 * It uses an external oracle to convert asset amounts to credit units.
 */
contract BorrowCredit is Ownable, IBorrowCredit {
    /// @notice Reference to the Oracle contract used for credit calculations
    IOracle public oracle;

    /// @notice List of whitelisted pool addresses allowed to interact with credit functions
    address[] public whitelisted;

    /// @notice Stores credit info for each borrower
    mapping(address => CreditInfo) public creditInfo;

    /**
     * @notice Initializes the BorrowCredit contract with a reference to the Oracle.
     * @param _oracle The address of the deployed Oracle contract.
     */
    constructor(address _oracle) Ownable(msg.sender) {
        oracle = IOracle(_oracle);
    }

    /**
     * @notice Deducts credit from a borrower when funds are drawn from a pool.
     * @dev Only callable by a whitelisted pool. Converts the drawn asset amount into credits.
     * @param borrower The address of the borrower.
     * @param amount The amount of assets being borrowed.
     */
    function spend(address borrower, uint256 amount) external onlyWhitelisted {
        _isPoolAccessible(msg.sender, borrower);

        IPool pool = IPool(msg.sender);
        uint256 credit = oracle.getCredits(pool.asset(), amount);

        CreditInfo storage info = creditInfo[borrower];
        require(info.available >= credit, "Insufficient credit");

        info.available -= credit;
        info.used += credit;

        emit CreditSpent(msg.sender, borrower, credit);
    }

    /**
     * @notice Restores credit to a borrower, typically when funds are repaid.
     * @dev Only callable by a whitelisted pool. Converts the asset amount into credits.
     * @param borrower The address of the borrower.
     * @param amount The amount of assets being replenished.
     */
    function replenish(
        address borrower,
        uint256 amount
    ) external onlyWhitelisted {
        IPool pool = IPool(msg.sender);
        uint256 credit = oracle.getCredits(pool.asset(), amount);

        CreditInfo storage info = creditInfo[borrower];
        info.available += credit;

        if (info.used >= credit) {
            info.used -= credit;
        } else {
            info.used = 0;
        }

        emit CreditReplenished(msg.sender, borrower, credit);
    }

    /**
     * @notice Creates a new credit allocation for a borrower.
     * @dev Only callable by the contract owner. Initializes the borrower's credit info.
     * @param _to The address of the borrower.
     * @param _metadata Metadata associated with the credit allocation.
     * @param _available The initial amount of available credits for the borrower.
     */
    function createCredits(
        address _to,
        Types.JSON memory _metadata,
        uint256 _available,
        address[] memory _accessiblePools
    ) external onlyOwner {
        require(
            creditInfo[_to].updatedAt == 0,
            "BorrowCredit: Already registered"
        );

        creditInfo[_to] = CreditInfo({
            metadata: _metadata,
            available: _available,
            used: 0,
            updatedAt: block.timestamp,
            accessiblePools: _accessiblePools
        });

        emit CreateCredits(_to, _metadata, _available, _accessiblePools);
    }

    /**
     * @notice Increments the available credits for a borrower.
     * @dev Only callable by the contract owner. Used to adjust credit balances.
     * @param to The address of the borrower whose credits are being incremented.
     * @param credits The amount of credits to increment.
     */
    function incrementCredits(address to, uint256 credits) external onlyOwner {
        creditInfo[to].available += credits;
        emit IncrementedCredits(to, credits);
    }

    /**
     * @notice Decrements the available credits for a borrower.
     * @dev Only callable by the contract owner. Used to adjust credit balances.
     * @param from The address of the borrower whose credits are being decremented.
     * @param credits The amount of credits to decrement.
     */
    function decrementCredits(
        address from,
        uint256 credits
    ) external onlyOwner {
        require(creditInfo[from].available >= credits, "Insufficient credits");

        creditInfo[from].available -= credits;

        emit DecrementedCredits(from, credits);
    }

    /**
     * @notice Adds an accessible pool to the borrower's list.
     * @dev Only callable by the contract owner.
     * @param to The address of the borrower.
     * @param pool The address of the pool to add to the borrower's list.
     */
    function addAccessiblePool(address to, address pool) external onlyOwner {
        creditInfo[to].accessiblePools.push(pool);

        emit AddedAccessiblePool(to, pool);
    }

    /**
     * @notice Removes an accessible pool from the borrower's list.
     * @dev Only callable by the contract owner.
     * @param to The address of the borrower.
     * @param pool The address of the pool to remove from the borrower's list.
     */
    function removeAccessiblePool(address to, address pool) external onlyOwner {
        address[] storage pools = creditInfo[to].accessiblePools;
        uint256 length = pools.length;

        for (uint256 i = 0; i < length; i++) {
            if (pools[i] == pool) {
                pools[i] = pools[length - 1];
                pools.pop();
                emit RemovedAccessiblePool(to, pool);
                return;
            }
        }

        revert("Pool not found");
    }

    /**
     * @notice Adds a new pool to the whitelist.
     * @dev Only callable by the contract owner.
     * @param pool The address of the pool to whitelist.
     */
    function addToWhitelist(address pool) external onlyOwner {
        whitelisted.push(pool);
    }

    /**
     * @notice Removes a pool from the whitelist.
     * @dev Only callable by the contract owner.
     * @param pool The address of the pool to remove from the whitelist.
     */
    function removeFromWhitelist(address pool) external onlyOwner {
        uint256 length = whitelisted.length;
        for (uint256 i = 0; i < length; i++) {
            if (whitelisted[i] == pool) {
                whitelisted[i] = whitelisted[length - 1];
                whitelisted.pop();
                return;
            }
        }
        revert("Pool not found");
    }

    /**
     * @notice Updates the Oracle contract used for credit calculations.
     * @dev Only callable by the contract owner.
     * @param _oracle The address of the new Oracle contract.
     */
    function setOracle(address _oracle) external onlyOwner {
        oracle = IOracle(_oracle);
    }

    /**
     * @notice Checks if a pool is accessible for a given borrower.
     * @param pool The address of the pool to check.
     * @param borrower The address of the borrower.
     */
    function _isPoolAccessible(address pool, address borrower) internal view {
        CreditInfo memory info = creditInfo[borrower];
        for (uint256 i = 0; i < info.accessiblePools.length; i++) {
            if (info.accessiblePools[i] == pool) {
                return;
            }
        }
        revert("Pool not accessible");
    }

    /**
     * @dev Restricts function access to whitelisted pool contracts only.
     * Reverts if the caller is not in the `whitelisted` array.
     */
    modifier onlyWhitelisted() {
        bool isWhitelisted = false;
        for (uint256 i = 0; i < whitelisted.length; i++) {
            if (whitelisted[i] == msg.sender) {
                isWhitelisted = true;
            }
        }
        require(isWhitelisted, "BorrowCredit: not whitelisted");
        _;
    }
}
