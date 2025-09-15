import { useEffect } from 'react';

interface WalletProviderProps {
  children: React.ReactNode;
}

// Jaringan Uomi
const UOMI_PARAMS = {
  chainId: '0x1122', // 4386 dalam hex
  chainName: 'Uomi',
  rpcUrls: ['https://turing.uomi.ai'],
  nativeCurrency: {
    name: 'Uomi',
    symbol: 'UOMI',
    decimals: 18,
  },
  blockExplorerUrls: ['https://explorer.uomi.ai'],
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  useEffect(() => {
    // Cek dan konek ke jaringan Uomi saat wallet connect
    const switchToUomi = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [UOMI_PARAMS],
          });
        } catch (err) {
          // User reject atau sudah di jaringan
        }
      }
    };
    switchToUomi();
  }, []);
  return <>{children}</>;
};