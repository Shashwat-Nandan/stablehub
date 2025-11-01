const { blogDb, userDb, initDatabase } = require('./backend/db/database');

// Initialize database first
initDatabase();

// Get admin user
const admin = userDb.findByUsername('admin');
if (!admin) {
  console.error('Admin user not found. Please ensure the database is initialized.');
  process.exit(1);
}

// Existing blog posts from HTML
const posts = [
  {
    title: 'Ethereum: The Foundation of DeFi Stablecoins',
    category: 'Layer-1',
    date_display: 'October 2025',
    content: `Ethereum remains the dominant Layer-1 blockchain for stablecoin issuance and deployment. With over $100 billion in stablecoin market cap, including USDT, USDC, and DAI, Ethereum's smart contract capabilities have made it the go-to platform for both centralized and decentralized stablecoins.

Key Features:
- ERC-20 token standard enabling seamless integration
- Robust DeFi ecosystem for stablecoin utility
- Post-merge energy efficiency improvements
- Strong security through extensive validator network

Notable Stablecoins: USDT, USDC, DAI, FRAX, LUSD`,
    status: 'published'
  },
  {
    title: 'Arbitrum & Optimism: Scaling Stablecoin Transactions',
    category: 'Layer-2',
    date_display: 'October 2025',
    content: `Optimistic rollups have emerged as critical infrastructure for stablecoin scalability. Arbitrum and Optimism offer significantly lower transaction fees while maintaining Ethereum's security guarantees, making them ideal for high-volume stablecoin transfers and DeFi operations.

Key Features:
- 10-100x lower transaction costs compared to Ethereum mainnet
- Native USDC deployment through Circle's Cross-Chain Transfer Protocol
- Growing DeFi ecosystems with familiar Ethereum tooling
- Fast finality for most transactions (instant on L2, ~7 days for L1 withdrawals)

Use Cases: High-frequency trading, micro-payments, cross-border remittances`,
    status: 'published'
  },
  {
    title: 'Polygon: Bridging Traditional Finance and Crypto',
    category: 'Layer-2',
    date_display: 'October 2025',
    content: `Polygon has positioned itself as a bridge between traditional finance and blockchain through its suite of scaling solutions. The network hosts numerous stablecoins and has attracted partnerships with major financial institutions exploring digital currency solutions.

Key Features:
- Polygon PoS: Fast, low-cost sidechain with wide stablecoin support
- Polygon zkEVM: Zero-knowledge rollup for enhanced privacy and scalability
- CDK (Chain Development Kit) for custom stablecoin chains
- Strong enterprise adoption and regulatory engagement

Innovation: Polygon is actively developing solutions for central bank digital currencies (CBDCs) and regulated stablecoins.`,
    status: 'published'
  },
  {
    title: 'Solana: High-Performance Stablecoin Infrastructure',
    category: 'Layer-1',
    date_display: 'October 2025',
    content: `Solana's high-throughput architecture has made it a competitive platform for stablecoin transactions, particularly for applications requiring fast finality and low costs. Despite network challenges in its early years, Solana has emerged as a viable alternative to Ethereum for stablecoin deployment.

Key Features:
- Sub-second transaction finality
- Transaction costs typically under $0.001
- Native USDC and PYUSD support
- Growing payment and remittance use cases

Ecosystem: Major stablecoins include USDC, USDT, PYUSD, and UXD Protocol's algorithmic stablecoin.`,
    status: 'published'
  },
  {
    title: 'Base: Coinbase\'s Onchain Economy Vision',
    category: 'Layer-2',
    date_display: 'October 2025',
    content: `Base, built on Optimism's OP Stack, represents Coinbase's commitment to bringing the next billion users onchain. As an L2 solution with deep integration to Coinbase's infrastructure, Base offers unique advantages for stablecoin adoption and mainstream use.

Key Features:
- Seamless fiat on/off ramps through Coinbase integration
- Low-cost USDC transactions with instant settlement
- Developer-friendly environment leveraging Ethereum tools
- Focus on consumer applications and payments

Adoption: Rapidly growing ecosystem with emphasis on social, gaming, and payment applications using stablecoins.`,
    status: 'published'
  },
  {
    title: 'Avalanche: Subnet Architecture for Specialized Stablecoins',
    category: 'Layer-1',
    date_display: 'October 2025',
    content: `Avalanche's subnet architecture allows for the creation of customized blockchains optimized for specific use cases, including stablecoins with unique regulatory requirements or performance characteristics.

Key Features:
- Subnet customization for compliance and governance
- Fast finality (typically under 2 seconds)
- Scalable consensus mechanism supporting thousands of validators
- Native integration with traditional finance systems

Focus: Institutional stablecoins and asset-backed tokens with specific regulatory requirements.`,
    status: 'published'
  },
  {
    title: 'zkSync & StarkNet: Zero-Knowledge Rollups for Privacy',
    category: 'Layer-2',
    date_display: 'October 2025',
    content: `Zero-knowledge rollups represent the cutting edge of L2 scaling technology, offering both enhanced privacy and security guarantees. zkSync and StarkNet are pioneering solutions that could reshape how stablecoins are used in privacy-sensitive applications.

Key Features:
- Mathematical proof of validity (no fraud proof delay)
- Enhanced privacy capabilities through zero-knowledge proofs
- Superior capital efficiency compared to optimistic rollups
- Growing stablecoin ecosystem with major issuers

Future Outlook: ZK-rollups are positioned to become dominant L2 solutions as the technology matures and tooling improves.`,
    status: 'published'
  },
  {
    title: 'Stellar & Algorand: Purpose-Built for Digital Assets',
    category: 'Layer-1',
    date_display: 'October 2025',
    content: `While newer L1s have captured attention, Stellar and Algorand continue to develop purpose-built infrastructure for stablecoins and digital assets, with particular focus on cross-border payments and financial inclusion.

Stellar Features:
- Built-in decentralized exchange for stablecoin swaps
- Path payment capabilities for automatic currency conversion
- Partnership with MoneyGram and other remittance providers
- Low-cost, fast transactions optimized for payments

Algorand Features:
- Pure proof-of-stake consensus with instant finality
- USDC native support through Circle partnership
- Focus on CBDC and regulated stablecoin projects
- Carbon-negative network appealing to ESG-focused issuers`,
    status: 'published'
  },
  {
    title: 'The Future: Interoperability and Cross-Chain Stablecoins',
    category: 'Emerging Tech',
    date_display: 'October 2025',
    content: `The next evolution in stablecoin infrastructure focuses on seamless interoperability across chains. Projects like LayerZero, Wormhole, and Circle's Cross-Chain Transfer Protocol (CCTP) are enabling native stablecoin movement across different L1s and L2s without traditional bridging risks.

Key Developments:
- Circle's CCTP enabling native USDC burns and mints across chains
- LayerZero's Omnichain Fungible Token (OFT) standard
- Chainlink's Cross-Chain Interoperability Protocol (CCIP)
- Account abstraction enabling chain-agnostic user experiences

Vision: A future where users interact with stablecoins without needing to know which blockchain they're using, with automatic routing to the most efficient network.`,
    status: 'published'
  }
];

// Migrate posts
console.log('Starting migration of blog posts...');

let successCount = 0;
let errorCount = 0;

posts.forEach((post, index) => {
  try {
    const postId = blogDb.create({
      title: post.title,
      category: post.category,
      content: post.content,
      author_id: admin.id,
      status: post.status,
      date_display: post.date_display
    });
    console.log(`✓ Migrated post ${index + 1}/${posts.length}: "${post.title}" (ID: ${postId})`);
    successCount++;
  } catch (error) {
    console.error(`✗ Failed to migrate post ${index + 1}/${posts.length}: "${post.title}"`, error.message);
    errorCount++;
  }
});

console.log('\n=== Migration Complete ===');
console.log(`Successfully migrated: ${successCount} posts`);
console.log(`Failed: ${errorCount} posts`);
console.log(`Total blog posts in database: ${blogDb.getAll().length}`);
