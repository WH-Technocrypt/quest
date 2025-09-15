
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Ganti mainnet dengan chain Uomi jika sudah ada, atau tambahkan chain custom jika perlu
const config = createConfig({
	chains: [mainnet], // Ganti dengan chain Uomi jika sudah ada
	transports: {
		[mainnet.id]: http('https://mainnet.infura.io/v3/YOUR_INFURA_KEY'), // Ganti dengan RPC Uomi jika perlu
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
