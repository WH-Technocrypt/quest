
import React from 'react';

interface WalletProviderProps {
  children: React.ReactNode;
}

// Sepolia: Tidak perlu custom provider, wagmi config sudah handle chain
export const WalletProvider = ({ children }: WalletProviderProps) => {
  return <>{children}</>;
};