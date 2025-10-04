import { useState } from 'react';
import { stablecoins } from '../data/stablecoins';

export default function Compare() {
  const [filter, setFilter] = useState('all');

  const filteredCoins = filter === 'all'
    ? stablecoins
    : stablecoins.filter(coin => coin.type === filter);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h2>Compare Global Stablecoin Options</h2>
          <p>Comprehensive comparison of major stablecoins across different blockchains</p>
        </div>
      </section>

      <section className="comparison-section">
        <div className="container">
          <div className="filter-section">
            <h3>Filter by Type</h3>
            <div className="filter-group">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Stablecoins
              </button>
              <button
                className={`filter-btn ${filter === 'fiat' ? 'active' : ''}`}
                onClick={() => setFilter('fiat')}
              >
                Fiat-Collateralized
              </button>
              <button
                className={`filter-btn ${filter === 'crypto' ? 'active' : ''}`}
                onClick={() => setFilter('crypto')}
              >
                Crypto-Collateralized
              </button>
              <button
                className={`filter-btn ${filter === 'algorithmic' ? 'active' : ''}`}
                onClick={() => setFilter('algorithmic')}
              >
                Algorithmic
              </button>
            </div>
          </div>

          <div className="comparison-grid">
            {filteredCoins.map((coin) => (
              <div key={coin.id} className="stablecoin-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{coin.name}</h3>
                    <span className="ticker">{coin.ticker}</span>
                  </div>
                  <span className={`type-badge ${coin.type}`}>
                    {coin.type === 'fiat' && 'Fiat-Backed'}
                    {coin.type === 'crypto' && 'Crypto-Backed'}
                    {coin.type === 'algorithmic' && 'Algorithmic'}
                  </span>
                </div>
                <div className="card-info">
                  <div className="info-row">
                    <span className="info-label">Market Cap</span>
                    <span className="info-value">{coin.marketCap}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Backing</span>
                    <span className="info-value">{coin.backing}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Issuer</span>
                    <span className="info-value">{coin.issuer}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Audited</span>
                    <span className="info-value">{coin.audited}</span>
                  </div>
                </div>
                <div className="chains">
                  <h4>Available on:</h4>
                  <div className="chain-tags">
                    {coin.chains.map((chain, idx) => (
                      <span key={idx} className="chain-tag">{chain}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
