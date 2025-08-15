# Credibble

### Problem Statement

Traditional lending institutions such as microfinance groups, cooperatives, and community lenders depend on steady funding to provide loans to individuals, students, farmers, artisans, and entrepreneurs.

When their access to affordable liquidity is limited, loan disbursements slow down, interest rates rise, and many are left without timely credit. This funding gap stalls business growth, reduces productivity, and causes a ripple effect that holds back both local and global economies.

Meanwhile, billions in DeFi yields remain locked within on-chain markets, disconnected from these real-world financing needs.

---

## Solution

Credibble bridges this gap by channeling DeFi liquidity directly into traditional lending pipelines through tokenized loan shares. Investors deposit digital assets into Credibble pools to earn sustainable returns, while vetted lending institutions access this capital to fund loans in their communities.
Each funding position is represented as an NFT, ensuring transparency, tradability, and proof of ownership.

By merging DeFi’s efficiency with real-world lending needs, Credibble enables broader access to fair credit and fuels inclusive economic growth.

<img width="734" height="253" alt="credibble_flow_2 drawio" src="https://github.com/user-attachments/assets/545e8ac0-2a0d-4913-8d48-81cfdae6324a" />

### Technical - Smart Contracts

| Contract | Description |
|----------|-------------|
| [PoolFactory.sol](https://github.com/credibble/hackathon/blob/main/smart-contracts/contracts/PoolFactory.sol) | Deploys and manages all **loan pools**. Serves as the entry point for creating new `Pool` contracts, setting standardized parameters, and tracking all active pools on the platform. |
| [Pool.sol](https://github.com/devarogundade/credibble/blob/main/smart-contracts/contracts/Pool.sol) | Represents a **single loan pool** where investor deposits are aggregated and lent to a partner lending institution. Handles deposits, withdrawals, yield distribution, and interaction with the `Shares` and `Position` contracts. |
| [Shares.sol](https://github.com/credibble/hackathon/blob/main/smart-contracts/contracts/core/Shares.sol) | An ERC721 (NFT) contract that issues **tradeable shares** to investors when they deposit into a pool. Each NFT represents proportional ownership and entitles the holder to yields and repayments from that pool. |
| [Position.sol](https://github.com/credibble/hackathon/blob/main/smart-contracts/contracts/core/Position.sol) | A **soul-bound NFT** record of a specific financial position, typically for borrowers or institutional access. Tracks loan terms, maturity, interest eligibility, and repayment progress for that position. |
| [BorrowCredit.sol](https://github.com/credibble/hackathon/blob/main/smart-contracts/contracts/core/BorrowCredit.sol) | Maintains and adjusts a **credit score or borrowing capacity** for each partner institution. Credits are **minted** based on collateral, repayment history, and performance, and **burned** when loans are repaid or defaults occur. Institutions spend this credit to access loan pools. |
| [Oracle.sol](https://github.com/credibble/hackathon/blob/main/smart-contracts/contracts/core/Oracle.sol) | Provides verified **price and market data** to ensure accurate valuation of assets, collateral, and repayments. Prevents manipulation by sourcing data from trusted feeds. |
| [Marketplace.sol](https://github.com/credibble/hackathon/blob/main/smart-contracts/contracts/MarketPlace.sol) | Facilitates **secondary trading of NFT shares** issued by `Shares.sol`. Enables investors to sell their pool positions before maturity, creating liquidity for otherwise locked investments. |

# Deployments

### Subgraph

https://thegraph.test2.btcs.network/subgraphs/name/credibble/graphql

### Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/86bc3916-712b-498a-a9c6-9a8a62b51b16/deploy-status)](https://app.netlify.com/projects/credible-core2/deploys)

### Waitlist Server

https://waitlist-api-hxeqb8fygvd9f0h5.canadacentral-01.azurewebsites.net
