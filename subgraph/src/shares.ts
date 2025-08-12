import {
  AddedShares as AddedSharesEvent,
  RemovedShares as RemovedSharesEvent,
  ClaimedShares as ClaimedSharesEvent,
  RevertShares as RevertSharesEvent,
} from "../generated/templates/Shares/Shares";
import { Share } from "../generated/schema";
import { getOrCreateUser } from "./utils";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleAddedShares(event: AddedSharesEvent): void {
  let shareId = event.address.toHex() + "-" + event.params.tokenId.toString();
  let share = Share.load(shareId);

  let user = getOrCreateUser(event.params.owner);

  if (!share) {
    // New share creation
    share = new Share(shareId);
    share.contract = event.address.toHex();
    share.owner = user.id;
    share.tokenId = event.params.tokenId;
    share.amount = event.params.amount;
    share.lockedAmount = BigInt.fromI32(0);
    share.timestamp = event.block.timestamp;
    share.withdrawalRequested = false;
    share.withdrawRequestTime = BigInt.fromI32(0);
    share.createdAt = event.block.timestamp;
  } else {
    share.amount = share.amount.plus(event.params.amount);
  }

  share.timestamp = event.params.timestamp;
  share.save();
}

export function handleRemovedShares(event: RemovedSharesEvent): void {
  let shareId = event.address.toHex() + "-" + event.params.tokenId.toString();
  let share = Share.load(shareId);
  if (!share) return;

  // Move shares to locked status
  share.amount = share.amount.minus(event.params.amount);
  share.lockedAmount = share.lockedAmount.plus(event.params.amount);
  share.withdrawalRequested = true;
  share.withdrawRequestTime = event.block.timestamp;
  share.save();
}

export function handleClosedShares(event: RemovedSharesEvent): void {
  let shareId = event.address.toHex() + "-" + event.params.tokenId.toString();
  let share = Share.load(shareId);
  if (!share) return;

  share.amount = BigInt.zero();
  share.lockedAmount = BigInt.zero();
  share.withdrawalRequested = false;
  share.withdrawRequestTime = BigInt.zero();
  share.timestamp = event.block.timestamp;
  share.save();
}

export function handleClaimedShares(event: ClaimedSharesEvent): void {
  let shareId = event.address.toHex() + "-" + event.params.tokenId.toString();
  let share = Share.load(shareId);
  if (!share) return;

  // Clear locked shares
  share.lockedAmount = BigInt.fromI32(0);
  share.withdrawalRequested = false;
  share.withdrawRequestTime = BigInt.fromI32(0);
  share.timestamp = event.block.timestamp;
  share.save();
}

export function handleRevertedShares(event: RevertSharesEvent): void {
  let shareId = event.address.toHex() + "-" + event.params.tokenId.toString();
  let share = Share.load(shareId);
  if (!share) return;

  // Move shares back from locked to active
  share.amount = share.amount.plus(event.params.lockedAmount);
  share.lockedAmount = BigInt.fromI32(0);
  share.withdrawalRequested = false;
  share.withdrawRequestTime = BigInt.fromI32(0);
  share.timestamp = event.block.timestamp;
  share.save();
}
