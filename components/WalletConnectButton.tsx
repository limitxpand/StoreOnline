'use client';
import { useState, useEffect } from 'react';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, parseUnits } from 'ethers';

// Web3Modal Setup
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const bsc = {
  chainId: 56,
  name: 'BNB Smart Chain',
  currency: 'BNB',
  explorerUrl: 'https://bscscan.com',
  rpcUrl: 'https://rpc.ankr.com/bsc'
}

const metadata = {
  name: 'Store Online',
  description: 'Premium Marketplace for MT4/MT5 EA',
  url: 'https://storeonline.in', 
  icons: ['https://storeonline.in/favicon.ico']
}

let web3ModalInitialized = false;

export default function WalletConnectButton({ 
  price, 
  cryptoCurrency, 
  adminWalletAddress, 
  walletConnectProjectId,
  onSuccess 
}: { 
  price: number;
  cryptoCurrency: string;
  adminWalletAddress: string;
  walletConnectProjectId: string;
  onSuccess: (txHash: string) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    setIsClient(true);
    if (!web3ModalInitialized && walletConnectProjectId) {
      createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [mainnet, bsc],
        projectId: walletConnectProjectId,
        enableAnalytics: false
      });
      web3ModalInitialized = true;
    }
  }, [walletConnectProjectId]);

  const handlePay = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!walletProvider || !adminWalletAddress) return;

    try {
      setIsProcessing(true);
      const provider = new BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner();

      // Basic calculation: send native token equivalent to USD price.
      // In a real app, use an oracle for price conversion or send ERC20 USDT.
      // For this demo, we assume price is in the native token unit (e.g. 0.05 ETH).
      // If price > 10, we'll divide by a large number for demo safety.
      let demoPriceStr = price.toString();
      if (price > 10) {
        demoPriceStr = (price / 1000).toFixed(4); // just for safe demo purposes
      }

      const tx = await signer.sendTransaction({
        to: adminWalletAddress,
        value: parseUnits(demoPriceStr, 18)
      });

      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      await tx.wait(1);
      
      onSuccess(tx.hash);
    } catch (err: any) {
      console.error("Payment failed", err);
      alert("Payment failed or was rejected. " + (err.message || ''));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient || !walletConnectProjectId) return null;

  return (
    <button 
      onClick={handlePay}
      disabled={isProcessing}
      style={{
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: isProcessing ? 'not-allowed' : 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        marginTop: '1rem',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>💎</span> 
      {isProcessing ? 'Processing Transaction...' : (isConnected ? `Pay $${price} with Crypto` : `Buy Now with Crypto`)}
    </button>
  );
}
