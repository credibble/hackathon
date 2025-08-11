import { CreatedPool as CreatedPoolEvent } from "../generated/PoolFactory/PoolFactory";
import { PoolFactory, Pool } from "../generated/schema";
import { Pool as PoolTemplate } from "../generated/templates";
import { BigInt } from "@graphprotocol/graph-ts";

export function handlePoolCreated(event: CreatedPoolEvent): void {
  let factory = PoolFactory.load(event.address.toHex());

  if (!factory) {
    factory = new PoolFactory(event.address.toHex());
    factory.save();
  }

  let pool = new Pool(event.params.pool.toHex());
  pool.name = event.params.name;
  pool.description = event.params.description;
  pool.symbol = event.params.symbol;
  pool.documents = event.params.documents.value;
  pool.terms = event.params.terms.__html;
  pool.contractAddress = event.params.pool;
  pool.asset = event.params.asset;
  pool.credit = event.params.credit;
  pool.lockPeriod = event.params.lockPeriod;
  pool.withdrawDelay = event.params.withdrawDelay;
  pool.borrowAPY = event.params.borrowAPY;
  pool.totalShares = BigInt.fromI32(0);
  pool.totalTVL = BigInt.fromI32(0);
  pool.totalBorrowed = BigInt.fromI32(0);
  pool.factory = factory.id;
  pool.createdAt = event.block.timestamp;
  pool.lastUpdated = event.block.timestamp;
  pool.save();

  // Start indexing the new pool
  PoolTemplate.create(event.params.pool);
}
