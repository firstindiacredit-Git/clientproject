import { createConfig, http } from "wagmi";
import { walletConnect } from "@wagmi/connectors";
import { mainnet, sepolia } from "viem/chains";

// Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

// Trust Wallet Gateway endpoint
const trustWalletGateway =
  import.meta.env.VITE_WALLETCONNECT_RELAY_URL ||
  "https://gateway.trustwallet.com/v2/projects/df7937a0-04b6-4033-b073-b17840466be1/nodes";

// Trust Wallet Analytics endpoint
const trustWalletAnalytics =
  import.meta.env.VITE_TRUST_WALLET_ANALYTICS ||
  "https://app-analytics.trustwallet.com/decide/?v=3&ip=1&_=1764829540169&ver=1.164.1&compression=base64";

// Trust Wallet Market Data endpoint
const trustWalletMarketData =
  import.meta.env.VITE_TRUST_WALLET_MARKET_DATA ||
  "https://gateway.us.trustwallet.com/v2/market/tickers";

// Trust Wallet Push Topics endpoint
const trustWalletPushTopics =
  import.meta.env.VITE_TRUST_WALLET_PUSH_TOPICS ||
  "https://gateway.us.trustwallet.com/v2/devices/1570c7529790357b62e75efe032c09742f21d9273d856296fbddc8b62b742512/push-topics";

// Trust Wallet Device endpoint
const trustWalletDevice =
  import.meta.env.VITE_TRUST_WALLET_DEVICE ||
  "https://gateway.us.trustwallet.com/v2/devices/1570c7529790357b62e75efe032c09742f21d9273d856296fbddc8b62b742512";

// Trust Wallet Assets endpoint
const trustWalletAssets =
  import.meta.env.VITE_TRUST_WALLET_ASSETS ||
  "https://gateway.us.trustwallet.com/v1/assets";

// Trust Wallet NFT Collections endpoint
const trustWalletNFTCollections =
  import.meta.env.VITE_TRUST_WALLET_NFT_COLLECTIONS ||
  "https://gateway.us.trustwallet.com/v3/nft/collections";

// Trust Wallet Device Wallet Register endpoint
const trustWalletDeviceWalletRegister =
  import.meta.env.VITE_TRUST_WALLET_DEVICE_WALLET_REGISTER ||
  "https://gateway.us.trustwallet.com/v3/devices/1570c7529790357b62e75efe032c09742f21d9273d856296fbddc8b62b742512/wallets/m_546d85ce9e4d0ece7942be62b91457500f4ac3e6/register";

// Trust Wallet Bitcoin Indexer base URL
const trustWalletBTCIndexerBase =
  import.meta.env.VITE_TRUST_WALLET_BTC_INDEXER_BASE ||
  "https://platform.trustwallet.com/v1/btc-indexer";

// Trust Wallet BSC TWNodes session endpoint
const trustWalletBSCSession =
  import.meta.env.VITE_TRUST_WALLET_BSC_SESSION ||
  "https://bsc.twnodes.com/naas/session/Mzk5YTg3Y2QtMTY4Yi00NWMzLWEzMTgtZGQ4NjNiYjNiMTg2";

// Trust Wallet BTC Blockbook TWNodes session base URL
const trustWalletBTCBlockbookBase =
  import.meta.env.VITE_TRUST_WALLET_BTC_BLOCKBOOK_BASE ||
  "https://btc-blockbook.twnodes.com/naas/session/Mzk5YTg3Y2QtMTY4Yi00NWMzLWEzMTgtZGQ4NjNiYjNiMTg2";

// Trust Wallet Stablecoin Invest Config endpoint
const trustWalletStablecoinConfig =
  import.meta.env.VITE_TRUST_WALLET_STABLECOIN_CONFIG ||
  "https://gateway.us.trustwallet.com/v1/invests/stablecoin/config";

// BNB Chain Staking Validators endpoint
const bnbChainValidatorsBase =
  import.meta.env.VITE_BNB_CHAIN_VALIDATORS_BASE ||
  "https://api.bnbchain.org/bnb-staking/v1/validator";

// Kiln The Graph Subgraph endpoint
const kilnTheGraphSubgraph =
  import.meta.env.VITE_KILN_THEGRAPH_SUBGRAPH ||
  "https://query.thegraph.kiln.fi/subgraphs/name/vsuite";

// Solana TWNodes session endpoint
const solanaSession =
  import.meta.env.VITE_SOLANA_SESSION ||
  "https://solana.twnodes.com/naas/session/NmQ2NzcxMjctZTQwNC00ZjVmLWE4ZDAtZTE5Y2Q3Mjc0MzNm";

// TON Domains API endpoint
const tonDomainsAPI =
  import.meta.env.VITE_TON_DOMAINS_API ||
  "https://gateway.us.trustwallet.com/amber-api/v1/domains?ton=true";

// Trust Wallet Register API endpoint
const trustWalletRegisterAPI =
  import.meta.env.VITE_TRUST_WALLET_REGISTER_API ||
  "https://gateway.us.trustwallet.com/v3/devices/ab700ac2c3a47bc0628f6368e482c374e5ba131f616462ae74751ed39e748362/wallets/m_e58de81e9c7ebac1e98a9871e5a41d2d343dc378/register";

const metadata = {
  name: "Trust Wallet Login",
  description: "Login with Trust Wallet",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://localhost:5173",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, sepolia];

// Create wagmi config using createConfig
const wagmiConfig = createConfig({
  chains,
  connectors: projectId
    ? [
        walletConnect({
          projectId,
          metadata,
          showQrModal: true,
        }),
      ]
    : [],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Set Trust Wallet gateway, analytics, market data, push topics, device, assets, NFT collections, device wallet register, BTC indexer, BSC session, BTC blockbook, and stablecoin config for WalletConnect connector
// This will be used by the WalletConnect connector when establishing connections
if (typeof window !== "undefined") {
  window.__WALLETCONNECT_RELAY_URL__ = trustWalletGateway;
  window.__TRUST_WALLET_ANALYTICS__ = trustWalletAnalytics;
  window.__TRUST_WALLET_MARKET_DATA__ = trustWalletMarketData;
  window.__TRUST_WALLET_PUSH_TOPICS__ = trustWalletPushTopics;
  window.__TRUST_WALLET_DEVICE__ = trustWalletDevice;
  window.__TRUST_WALLET_ASSETS__ = trustWalletAssets;
  window.__TRUST_WALLET_NFT_COLLECTIONS__ = trustWalletNFTCollections;
  window.__TRUST_WALLET_DEVICE_WALLET_REGISTER__ =
    trustWalletDeviceWalletRegister;
  window.__TRUST_WALLET_BTC_INDEXER_BASE__ = trustWalletBTCIndexerBase;
  window.__TRUST_WALLET_BSC_SESSION__ = trustWalletBSCSession;
  window.__TRUST_WALLET_BTC_BLOCKBOOK_BASE__ = trustWalletBTCBlockbookBase;
  window.__TRUST_WALLET_STABLECOIN_CONFIG__ = trustWalletStablecoinConfig;
  window.__BNB_CHAIN_VALIDATORS_BASE__ = bnbChainValidatorsBase;
  window.__KILN_THEGRAPH_SUBGRAPH__ = kilnTheGraphSubgraph;
}

console.log("✅ Wagmi config initialized successfully");
console.log("📍 Trust Wallet Gateway:", trustWalletGateway);
console.log("📊 Trust Wallet Analytics:", trustWalletAnalytics);
console.log("📈 Trust Wallet Market Data:", trustWalletMarketData);
console.log("🔔 Trust Wallet Push Topics:", trustWalletPushTopics);
console.log("📱 Trust Wallet Device:", trustWalletDevice);
console.log("💎 Trust Wallet Assets:", trustWalletAssets);
console.log("🖼️ Trust Wallet NFT Collections:", trustWalletNFTCollections);
console.log(
  "📝 Trust Wallet Device Wallet Register:",
  trustWalletDeviceWalletRegister
);
console.log("₿ Trust Wallet BTC Indexer Base:", trustWalletBTCIndexerBase);
console.log("🔷 Trust Wallet BSC Session:", trustWalletBSCSession);
console.log("₿ Trust Wallet BTC Blockbook Base:", trustWalletBTCBlockbookBase);
console.log("💰 Trust Wallet Stablecoin Config:", trustWalletStablecoinConfig);
console.log("🔷 BNB Chain Validators Base:", bnbChainValidatorsBase);
console.log("📊 Kiln The Graph Subgraph:", kilnTheGraphSubgraph);
console.log(
  "💡 Trust Wallet gateway, analytics, market data, push topics, device, assets, NFT collections, device wallet register, BTC indexer, BSC session, BTC blockbook, stablecoin config, BNB Chain validators, and Kiln The Graph subgraph configured"
);

export {
  wagmiConfig,
  trustWalletGateway,
  trustWalletAnalytics,
  trustWalletMarketData,
  trustWalletPushTopics,
  trustWalletDevice,
  trustWalletAssets,
  trustWalletNFTCollections,
  trustWalletDeviceWalletRegister,
  trustWalletBTCIndexerBase,
  trustWalletBSCSession,
  trustWalletBTCBlockbookBase,
  trustWalletStablecoinConfig,
  bnbChainValidatorsBase,
  kilnTheGraphSubgraph,
  solanaSession,
  tonDomainsAPI,
  trustWalletRegisterAPI,
};
