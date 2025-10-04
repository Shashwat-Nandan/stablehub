export const stablecoins = [
  {
    id: 'usdt',
    name: 'Tether',
    ticker: 'USDT',
    type: 'fiat',
    marketCap: '$120B+',
    backing: 'USD Reserves',
    issuer: 'Tether Limited',
    audited: 'Attestations',
    chains: ['Ethereum', 'Tron', 'Solana', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism']
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    ticker: 'USDC',
    type: 'fiat',
    marketCap: '$35B+',
    backing: 'USD Reserves',
    issuer: 'Circle',
    audited: 'Monthly Audits',
    chains: ['Ethereum', 'Solana', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism', 'Base']
  },
  {
    id: 'dai',
    name: 'Dai',
    ticker: 'DAI',
    type: 'crypto',
    marketCap: '$5B+',
    backing: 'Crypto Collateral',
    issuer: 'MakerDAO',
    audited: 'On-Chain',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base']
  },
  {
    id: 'busd',
    name: 'Binance USD',
    ticker: 'BUSD',
    type: 'fiat',
    marketCap: '$3B+',
    backing: 'USD Reserves',
    issuer: 'Paxos',
    audited: 'Monthly Audits',
    chains: ['Ethereum', 'BNB Chain']
  },
  {
    id: 'frax',
    name: 'Frax',
    ticker: 'FRAX',
    type: 'algorithmic',
    marketCap: '$800M+',
    backing: 'Fractional-Algorithmic',
    issuer: 'Frax Finance',
    audited: 'On-Chain',
    chains: ['Ethereum', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism']
  },
  {
    id: 'tusd',
    name: 'TrueUSD',
    ticker: 'TUSD',
    type: 'fiat',
    marketCap: '$2B+',
    backing: 'USD Reserves',
    issuer: 'Techteryx',
    audited: 'Real-time',
    chains: ['Ethereum', 'Tron', 'BNB Chain', 'Avalanche']
  }
];
