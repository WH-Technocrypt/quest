import { useState } from 'react';

export function useWalletConnection() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        // User rejected
      }
    }
    setIsConnecting(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return { account, isConnecting, connectWallet, disconnectWallet };
}
