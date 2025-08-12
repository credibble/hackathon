// CreditInfo single
export const QUERY_CREDIT_INFO = `
  query CreditInfo($address: ID!) {
    creditInfo(id: $address) {
      id
      user { id }
      metadata
      available
      used
      createdAt
      lastUpdated
    }
  }
`;

// CreditInfos paginated
export const QUERY_CREDIT_INFOS = `
  query CreditInfos($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String) {
    creditInfos(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      user { id }
      metadata
      available
      used
      createdAt
      lastUpdated
    }
    creditInfosCount: creditInfos {
      id
    }
  }
`;

export const QUERY_ALL_POOLS = `
  query AllPools {
    pools {
      id
      name
      description
      symbol
      documents
      terms
      contractAddress
      asset
      credit
      lockPeriod
      withdrawDelay
      borrowAPY
      totalShares
      totalTVL
      totalBorrowed
      createdAt
      lastUpdated
      sharesContract { id address createdAt }
      positionContract { 
        id address createdAt 
        positions { 
          id 
          borrower { id credit { metadata } }
          tokenId 
          amount 
          dueAmount 
          timestamp 
          createdAt 
        }
      }
      snapshots(first: 5, orderBy: date, orderDirection: asc) {
        id date openingTVL closingTVL openingBorrowed closingBorrowed highBorrowed lowBorrowed
      }
    }
  }
`;

// Pools paginated, filterable, sortable
export const QUERY_POOLS = `
  query Pools($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String, $where: Pool_filter) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      name
      description
      symbol
      documents
      terms
      contractAddress
      asset
      credit
      lockPeriod
      withdrawDelay
      borrowAPY
      totalShares
      totalTVL
      totalBorrowed
      createdAt
      lastUpdated
      sharesContract { id address createdAt }
      positionContract { 
        id address createdAt 
        positions { 
          id borrower { id credit { metadata } } 
          amount dueAmount timestamp createdAt 
        }
      }
      snapshots(first: 5, orderBy: date, orderDirection: asc) {
        id date openingTVL closingTVL openingBorrowed closingBorrowed highBorrowed lowBorrowed
      }
    }
    poolsCount: pools(where: $where) {
      id
    }
  }
`;

export const QUERY_POOL_BY_SYMBOL = `
  query PoolBySymbol($symbol: String!, $address: String!) {
    pools(where: { symbol_contains_nocase: $symbol }) {
      id
      name
      description
      symbol
      documents
      terms
      contractAddress
      asset
      credit
      lockPeriod
      withdrawDelay
      borrowAPY
      totalShares
      totalTVL
      totalBorrowed
      createdAt
      lastUpdated
      sharesContract { 
        id 
        address 
        createdAt
        shares {
          id
          tokenId
          amount
          lockedAmount
          timestamp
          withdrawalRequested
          withdrawRequestTime
          createdAt
        }
        myShares: shares(where: { owner: $address }) {
          id
          owner { id }
          contract { address }
          tokenId
          amount
          lockedAmount
          timestamp
          withdrawalRequested
          withdrawRequestTime
          createdAt
        }
      }
      positionContract { 
        id 
        address 
        createdAt 
        positions {
          id 
          borrower { id credit { metadata } } 
          amount 
          dueAmount 
          timestamp 
          createdAt 
        }        
        myPositions: positions(where: { borrower: $address }) {
          id 
          borrower { id credit { metadata } } 
          amount 
          dueAmount 
          timestamp 
          createdAt 
        }
      }        
      snapshots(first: 20, orderBy: date, orderDirection: desc) {
        id
        date
        openingTVL
        closingTVL
        openingBorrowed
        closingBorrowed
        highBorrowed
        lowBorrowed
      }
    }
  }
`;

export const QUERY_USER_SHARES = `
  query UserShares($first: Int!, $skip: Int!, $where: Share_filter) {
    shares(first: $first, skip: $skip, where: $where) {
      id
      contract {
        address
        pool { 
          id 
          contractAddress
          name 
          asset 
          symbol 
          totalTVL
          totalBorrowed
          totalShares
          lockPeriod
        }
      }
      tokenId
      amount
      lockedAmount
      timestamp
      withdrawalRequested
      withdrawRequestTime
      createdAt
    }
    sharesCount: shares(where: $where) {
      id
    }
  }
`;

export const QUERY_USER_POSITIONS = `
  query UserPositions($first: Int!, $skip: Int!, $where: Position_filter) {
    positions(first: $first, skip: $skip, where: $where) {
      id
      contract {
        address
        pool { 
          id 
          contractAddress
          name 
          asset 
          symbol 
          totalTVL
          totalBorrowed
          totalShares
          lockPeriod
          borrowAPY
        }
      }
      tokenId
      amount
      dueAmount
      timestamp
      createdAt
    }
    positionsCount: positions(where: $where) {
      id
    }
  }
`;

export const QUERY_MARKET_LISTINGS = `
  query MarketListings($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String, $where: MarketListing_filter) {
    marketListings(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      status
      tokenId
      vault
      price
      expiresIn
      paymentToken
      share {
        id
        amount
        timestamp
      }
      shares {
        address
        pool { id name symbol }
      }
      seller {
        id
      }
      createdAt
    }
    marketListingsCount: marketListings(where: $where) {
      id
    }
  }
`;

export const QUERY_TRANSACTIONS = `
  query Transactions($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String, $where: Transaction_filter) {
    transactions(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      type
      txHash
      pool { 
        id 
        name 
        symbol 
        asset
      }
      user { id }
      amount
      token
      timestamp
    }
    transactionsCount: transactions(where: $where) {
      id
    }
  }
`;

export const QUERY_CREDIT_RATE = `
  query CreditRate($asset: String!) {
    creditFeed(id: $asset) {
      id
      ratio
    }
  }
`;
