import { User, Pool, PoolSnapshot } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function createPoolSnapshot(pool: Pool, timestamp: BigInt): void {
  let date = timestamp.toI32() / 60;
  let dailyId = pool.id + "-" + date.toString();
  let daily = PoolSnapshot.load(dailyId);

  if (!daily) {
    daily = new PoolSnapshot(dailyId);
    daily.pool = pool.id;
    daily.date = date * 60;
    daily.openingTVL = pool.totalTVL;
    daily.closingTVL = BigInt.zero();
    daily.highTVL = BigInt.zero();
    daily.lowTVL = BigInt.zero();
    daily.openingShares = pool.totalShares;
    daily.closingShares = BigInt.zero();
    daily.openingBorrowed = pool.totalBorrowed;
    daily.closingBorrowed = BigInt.zero();
    daily.highBorrowed = BigInt.zero();
    daily.lowBorrowed = BigInt.zero();
  }

  daily.closingTVL = pool.totalTVL;
  daily.closingShares = pool.totalShares;
  daily.closingBorrowed = pool.totalBorrowed;

  // Track highs
  if (pool.totalTVL > daily.highTVL || daily.highTVL.equals(BigInt.zero())) {
    daily.highTVL = pool.totalTVL;
  }
  if (
    pool.totalBorrowed > daily.highBorrowed ||
    daily.highBorrowed.equals(BigInt.zero())
  ) {
    daily.highBorrowed = pool.totalBorrowed;
  }

  // Track lows
  if (pool.totalTVL < daily.lowTVL || daily.lowTVL.equals(BigInt.zero())) {
    daily.lowTVL = pool.totalTVL;
  }
  if (
    pool.totalBorrowed < daily.lowBorrowed ||
    daily.lowBorrowed.equals(BigInt.zero())
  ) {
    daily.lowBorrowed = pool.totalBorrowed;
  }

  daily.save();
}

export function getOrCreateUser(address: Bytes): User {
  let user = User.load(address.toHex());
  if (!user) {
    user = new User(address.toHex());
    user.save();
  }
  return user;
}
