import {
  IncrementPosition as IncrementPositionEvent,
  DecrementPosition as DecrementPositionEvent,
} from "../generated/templates/Position/Position";
import { Position } from "../generated/schema";
import { getOrCreateUser } from "./utils";
import { BigInt } from "@graphprotocol/graph-ts";

export function handlePositionIncremented(event: IncrementPositionEvent): void {
  let user = getOrCreateUser(event.params.borrower);
  let positionId = `${event.address.toHex()}-${event.params.tokenId.toString()}`;
  let position = Position.load(positionId);

  if (!position) {
    position = new Position(positionId);
    position.contract = event.address.toHex();
    position.borrower = user.id;
    position.tokenId = event.params.tokenId;
    position.amount = event.params.amount;
    position.dueAmount = event.params.dueAmount;
    position.timestamp = event.block.timestamp;
    position.createdAt = event.block.timestamp;
  } else {
    position.amount = position.amount.plus(event.params.amount);
    position.dueAmount = position.dueAmount.plus(event.params.dueAmount);
  }

  position.timestamp = event.block.timestamp;
  position.save();
}

export function handlePositionDecremented(event: DecrementPositionEvent): void {
  let positionId = `${event.address.toHex()}-${event.params.tokenId.toString()}`;
  let position = Position.load(positionId);
  if (!position) return;

  if (position.dueAmount >= event.params.repayAmount) {
    position.dueAmount = position.dueAmount.minus(event.params.repayAmount);
  } else {
    position.amount = position.amount.minus(
      event.params.repayAmount.minus(position.dueAmount)
    );
    position.dueAmount = BigInt.fromI32(0);
  }

  position.timestamp = event.block.timestamp;
  position.save();
}
