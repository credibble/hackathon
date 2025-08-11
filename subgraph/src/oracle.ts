import { CreditToAssetSet as CreditToAssetSetEvent } from "./../generated/Oracle/Oracle";
import { CreditFeed } from "../generated/schema";

export function handleCreditToAssetSet(event: CreditToAssetSetEvent): void {
  let creditFeed = CreditFeed.load(event.params.asset.toHex());

  if (!creditFeed) {
    creditFeed = new CreditFeed(event.params.asset.toHex());
    creditFeed.asset = event.params.asset;
    creditFeed.createdAt = event.block.timestamp;
  }

  creditFeed.ratio = event.params.credit;
  creditFeed.lastUpdated = event.block.timestamp;
  creditFeed.save();
}
