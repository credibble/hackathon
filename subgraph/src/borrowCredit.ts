import {
  CreateCredits as CreateCreditsEvent,
  CreditSpent as CreditSpentEvent,
  CreditReplenished as CreditReplenishedEvent,
  IncrementedCredits as IncrementedCreditsEvent,
  DecrementedCredits as DecrementedCreditsEvent,
  AddedAccessiblePool as AddedAccessiblePoolEvent,
  RemovedAccessiblePool as RemovedAccessiblePoolEvent,
} from "../generated/BorrowCredit/BorrowCredit";
import { CreditInfo, Transaction } from "../generated/schema";
import { getOrCreateUser } from "./utils";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleCreditCreated(event: CreateCreditsEvent): void {
  // Create user if doesn't exist
  let user = getOrCreateUser(event.params.to);

  // Create credit info
  let credit = new CreditInfo(user.id);
  credit.user = user.id;
  credit.available = event.params.credits;
  credit.used = BigInt.fromI32(0);
  credit.metadata = event.params.metadata.value;
  credit.available = event.params.credits;
  let pools: string[] = [];
  for (let i = 0; i < event.params.pools.length; i++) {
    pools.push(event.params.pools[i].toHexString());
  }
  credit.accessiblePools = pools;
  credit.createdAt = event.block.timestamp;
  credit.lastUpdated = event.block.timestamp;
  credit.save();

  // Create credit transaction
  let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let tx = new Transaction(txId);
  tx.user = user.id;
  tx.type = "create_credits";
  tx.amount = event.params.credits;
  tx.token = event.address;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();
}

export function handleCreditSpent(event: CreditSpentEvent): void {
  let user = getOrCreateUser(event.params.borrower);
  let credit = CreditInfo.load(user.id);
  if (!credit) return;

  // Update credit balances
  credit.available = credit.available.minus(event.params.credits);
  credit.used = credit.used.plus(event.params.credits);
  credit.lastUpdated = event.block.timestamp;
  credit.save();

  // Create credit transaction
  let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let tx = new Transaction(txId);
  tx.pool = event.params.pool.toHex();
  tx.user = user.id;
  tx.type = "spend_credits";
  tx.amount = event.params.credits;
  tx.token = event.address;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();
}

export function handleCreditReplenished(event: CreditReplenishedEvent): void {
  let user = getOrCreateUser(event.params.borrower);

  let credit = CreditInfo.load(user.id);
  if (!credit) return;

  // Update credit balances
  credit.available = credit.available.plus(event.params.credits);

  if (credit.used >= event.params.credits) {
    credit.used = credit.used.minus(event.params.credits);
  } else {
    credit.used = BigInt.fromI32(0);
  }

  credit.lastUpdated = event.block.timestamp;
  credit.save();

  // Create credit transaction
  let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let tx = new Transaction(txId);
  tx.pool = event.params.pool.toHex();
  tx.user = user.id;
  tx.type = "replenish_credits";
  tx.amount = event.params.credits;
  tx.txHash = event.transaction.hash;
  tx.token = event.address;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();
}

export function handleIncrementedCredits(event: IncrementedCreditsEvent): void {
  let user = getOrCreateUser(event.params.to);
  let credit = CreditInfo.load(user.id);
  if (!credit) {
    credit = new CreditInfo(user.id);
    credit.user = user.id;
    credit.available = BigInt.fromI32(0);
    credit.used = BigInt.fromI32(0);
  }

  credit.available = credit.available.plus(event.params.credits);
  credit.lastUpdated = event.block.timestamp;
  credit.save();

  // Create credit transaction
  let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let tx = new Transaction(txId);
  tx.user = user.id;
  tx.type = "increment_credits";
  tx.amount = event.params.credits;
  tx.token = event.address;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();
}

export function handleDecrementedCredits(event: DecrementedCreditsEvent): void {
  let user = getOrCreateUser(event.params.from);
  let credit = CreditInfo.load(user.id);
  if (!credit) return;

  if (credit.available >= event.params.credits) {
    credit.available = credit.available.minus(event.params.credits);
  } else {
    credit.available = BigInt.fromI32(0);
  }

  credit.lastUpdated = event.block.timestamp;
  credit.save();

  // Create credit transaction
  let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let tx = new Transaction(txId);
  tx.user = user.id;
  tx.type = "decrement_credits";
  tx.amount = event.params.credits;
  tx.token = event.address;
  tx.txHash = event.transaction.hash;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.save();
}

export function handleAddedAccessiblePool(
  event: AddedAccessiblePoolEvent
): void {
  let user = getOrCreateUser(event.params.to);
  let credit = CreditInfo.load(user.id);
  if (!credit) return;

  let pools = credit.accessiblePools || [];
  pools.push(event.params.pool.toHex());
  credit.accessiblePools = pools;

  credit.lastUpdated = event.block.timestamp;
  credit.save();
}

export function handleRemovedAccessiblePool(
  event: RemovedAccessiblePoolEvent
): void {
  let user = getOrCreateUser(event.params.to);
  let credit = CreditInfo.load(user.id);
  if (!credit) return;
  if (!credit.accessiblePools || !credit.accessiblePools.length) return;

  let index = credit.accessiblePools.indexOf(event.params.pool.toHex());
  if (index >= 0) {
    credit.accessiblePools.splice(index, 1);
  }

  credit.lastUpdated = event.block.timestamp;
  credit.save();
}
