
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { CHAIN_ID, RPC_URL, EXPLORER_URL } from '@/lib/blockchainConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Define custom Sepolia chain, config diambil dari blockchainConfig.ts
const sepoliaChain = defineChain({
  id: CHAIN_ID,
  name: 'Ethereum Sepolia',
  network: 'sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: EXPLORER_URL.replace(/\/$/, '') },
  },
  testnet: true,
});

const config = createConfig({
	chains: [sepoliaChain],
	transports: {
		[CHAIN_ID]: http(RPC_URL),
	},
	// Tambahkan connector jika perlu
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<WagmiProvider config={config}>
			<App />
		</WagmiProvider>
	</QueryClientProvider>
);
