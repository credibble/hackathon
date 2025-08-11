import {
  Listed as ListedEvent,
  Purchased as PurchasedEvent,
  Delisted as DelistedEvent,
} from "../generated/Marketplace/Marketplace";
import { MarketListing, Share } from "../generated/schema";
import { getOrCreateUser } from "./utils";

export function handleListed(event: ListedEvent): void {
  // Create or update MarketListing
  let listing = new MarketListing(event.params.id.toString());
  let user = getOrCreateUser(event.params.seller);

  let share = Share.load(
    event.params.shares.toHex() + "-" + event.params.vaultTokenId.toString()
  );
  if (!share) return;

  // Set listing properties from event
  listing.vault = event.params.vault;
  listing.seller = user.id;
  listing.share = share.id;
  listing.shareAmount = share.amount;
  listing.shares = event.params.shares.toHex();
  listing.tokenId = event.params.vaultTokenId;
  listing.paymentToken = event.params.paymentToken;
  listing.price = event.params.price;
  listing.expiresIn = event.params.expiresIn;
  listing.status = "active";
  listing.createdAt = event.block.timestamp;

  listing.save();
}

export function handlePurchased(event: PurchasedEvent): void {
  let listing = MarketListing.load(event.params.id.toString());
  if (!listing) return;

  // Update listing status to sold
  listing.status = "sold";
  listing.save();
}

export function handleDelisted(event: DelistedEvent): void {
  let listing = MarketListing.load(event.params.id.toString());
  if (!listing) return;

  // Update listing status to cancelled
  listing.status = "cancelled";
  listing.save();
}
