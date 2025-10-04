# Stablecoin Comparison Website

A comprehensive website for comparing global stablecoin options and exploring Layer-1 and Layer-2 blockchain solutions focused on stablecoins.

## Features

- **Blog Section**: In-depth articles about different L1 and L2 blockchain solutions including Ethereum, Solana, Arbitrum, Optimism, Polygon, Base, zkSync, StarkNet, Avalanche, Stellar, and Algorand
- **Comparison Tool**: Compare major stablecoins including USDT, USDC, DAI, PYUSD, FRAX, and more
- **Filter Options**: Filter stablecoins by type (fiat-backed, crypto-backed, algorithmic)
- **Multiple Views**: Toggle between grid and table views for comparison
- **Responsive Design**: Mobile-friendly layout

## Running the Website

### Option 1: Using Python (Recommended)

```bash
cd stablecoin-website
npm start
# or
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`

### Option 2: Using Node.js http-server

```bash
cd stablecoin-website
npx http-server -p 8000
```

### Option 3: Open directly in browser

Simply open `index.html` in your web browser.

## Project Structure

```
stablecoin-website/
├── index.html          # Main blog page with L1/L2 content
├── compare.html        # Stablecoin comparison page
├── css/
│   └── style.css       # Styling for all pages
├── js/
│   └── compare.js      # Interactive filtering and view toggle
├── package.json        # Project metadata
└── README.md          # This file
```

## Stablecoins Covered

- **Fiat-Backed**: USDT, USDC, FDUSD, PYUSD, TUSD, USDP, GUSD
- **Crypto-Backed**: DAI, LUSD, USDe
- **Algorithmic/Hybrid**: FRAX, USDD

## Blockchain Networks Featured

- **Layer-1**: Ethereum, Solana, Avalanche, Stellar, Algorand
- **Layer-2**: Arbitrum, Optimism, Polygon, Base, zkSync, StarkNet

## Educational Purpose

This website is designed for educational and research purposes. It is not financial advice. Always conduct your own research before making investment decisions.
