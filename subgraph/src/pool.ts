import {
  InitializedPool as InitializedPoolEvent,
  DepositedPool as DepositedEvent,
  BorrowedPool as BorrowedEvent,
  RepaidPool as RepaidEvent,
  RequestedWithdrawPool as RequestedWithdrawEvent,
  WithdrawCancelledPool as WithdrawCancelledEvent,
  ClaimedWithdrawPool as ClaimedWithdrawEvent,
  SetBorrowApy as SetBorrowApyEvent,
  SetWithdrawDelay as SetWithdrawDelayEvent,
  SetLockPeriod as SetLockPeriodEvent,
} from "../generated/templates/Pool/Pool";
import {
  Pool,
  Transaction,
  SharesContract,
  PositionContract,
} from "../generated/schema";
import { createPoolSnapshot, getOrCreateUser } from "./utils";
import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Shares as SharesTemplate,
  Position as PositionTemplate,
} from "../generated/templates";

export function handlePoolInitialized(event: InitializedPoolEvent): void {
  let sharesAddress = event.params.sharesToken;
  let positionAddress = event.params.positionToken;

  // Create and track Shares contract
  let sharesContract = new SharesContract(sharesAddress.toHexString());
  sharesContract.pool = event.address.toHex();
  sharesContract.address = sharesAddress;
  sharesContract.createdAt = event.block.timestamp;
  sharesContract.save();

  // Create and track Position contract
  let positionContract = new PositionContract(positionAddress.toHexString());
  positionContract.pool = event.address.toHex();
  positionContract.address = positionAddress;
  positionContract.createdAt = event.block.timestamp;
  positionContract.save();

  // Start indexing the dynamic contracts
  SharesTemplate.create(sharesAddress);
  PositionTemplate.create(positionAddress);
}

export function handleDeposited(event: DepositedEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  let userAddress = event.params.owner;
  let user = getOrCreateUser(userAddress);

  // Update pool metrics
  pool.totalTVL = pool.totalTVL.plus(event.params.amount);
  pool.totalShares = pool.totalShares.plus(event.params.shares);
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  // Create transaction
  let tx = new Transaction(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  tx.pool = pool.id;
  tx.user = user.id;
  tx.type = "deposit";
  tx.amount = event.params.amount;
  tx.token = pool.asset;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();

  // Create historical snapshots
  createPoolSnapshot(pool, event.block.timestamp);
}

export function handleBorrowed(event: BorrowedEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  let borrowerAddress = event.params.borrower;
  let borrower = getOrCreateUser(borrowerAddress);

  // Update pool metrics
  pool.totalBorrowed = pool.totalBorrowed.plus(event.params.amount);
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  // Create transaction
  let tx = new Transaction(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  tx.pool = pool.id;
  tx.user = borrower.id;
  tx.type = "borrow";
  tx.amount = event.params.amount;
  tx.token = pool.asset;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();

  // Create historical snapshots
  createPoolSnapshot(pool, event.block.timestamp);
}

export function handleRepaid(event: RepaidEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  let repayerAddress = event.params.repayer;
  let repayer = getOrCreateUser(repayerAddress);

  // Update pool metrics
  let repayAmount = event.params.amount;
  if (pool.totalBorrowed >= repayAmount) {
    pool.totalBorrowed = pool.totalBorrowed.minus(repayAmount);
  } else {
    pool.totalBorrowed = BigInt.zero();
  }

  // Add interest to TVL
  pool.totalTVL = pool.totalTVL.plus(event.params.interest);
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  // Create transaction
  let tx = new Transaction(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  tx.pool = pool.id;
  tx.user = repayer.id;
  tx.type = "repay";
  tx.amount = event.params.amount;
  tx.token = pool.asset;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();

  // Create historical snapshots
  createPoolSnapshot(pool, event.block.timestamp);
}

export function handleWithdrawRequested(event: RequestedWithdrawEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  pool.totalShares = pool.totalShares.minus(event.params.shares);

  let userAddress = event.params.owner;
  let user = getOrCreateUser(userAddress);

  // Create transaction
  let tx = Transaction.load(
    user.id.concat(pool.id).concat(event.params.tokenId.toHex())
  );

  if (!tx) {
    tx = new Transaction(
      user.id.concat(pool.id).concat(event.params.tokenId.toHex())
    );
    tx.amount = BigInt.zero();
  }

  tx.pool = pool.id;
  tx.user = user.id;
  tx.type = "withdrawRequest";
  tx.amount = tx.amount.plus(event.params.shares);
  tx.token = Bytes.empty();
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();
}

export function handleWithdrawCancelled(event: WithdrawCancelledEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  let userAddress = event.params.owner;
  let user = getOrCreateUser(userAddress);

  // Update pool metrics
  pool.totalShares = pool.totalShares.plus(event.params.shares);
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  // Lookup transaction
  let tx = Transaction.load(
    user.id.concat(pool.id).concat(event.params.tokenId.toHex())
  );
  if (!tx) return;
  tx.type = "withdrawCancel";
  tx.timestamp = event.block.timestamp;
  tx.txHash = event.transaction.hash;
  tx.blockNumber = event.block.number;
  tx.save();

  // Create historical snapshots
  createPoolSnapshot(pool, event.block.timestamp);
}

export function handleWithdrawClaimed(event: ClaimedWithdrawEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  let userAddress = event.params.owner;
  let user = getOrCreateUser(userAddress);

  // Update pool metrics
  pool.totalTVL = pool.totalTVL.minus(event.params.amountOut);
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  // Lookup transaction
  let tx = Transaction.load(
    user.id.concat(pool.id).concat(event.params.tokenId.toHex())
  );
  if (!tx) return;
  tx.type = "withdraw";
  tx.timestamp = event.block.timestamp;
  tx.txHash = event.transaction.hash;
  tx.blockNumber = event.block.number;
  tx.save();

  // Create historical snapshots
  createPoolSnapshot(pool, event.block.timestamp);
}

export function handleSetBorrowApy(event: SetBorrowApyEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  pool.borrowAPY = event.params.borrowAPY;
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  createPoolSnapshot(pool, event.block.timestamp);
}

export function handleSetWithdrawDelay(event: SetWithdrawDelayEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  pool.withdrawDelay = event.params.withdrawDelay;
  pool.lastUpdated = event.block.timestamp;
  pool.save();
}

export function handleSetLockPeriod(event: SetLockPeriodEvent): void {
  let poolAddress = event.address;
  let pool = Pool.load(poolAddress.toHexString());
  if (!pool) return;

  pool.lockPeriod = event.params.lockPeriod;
  pool.lastUpdated = event.block.timestamp;
  pool.save();
}
