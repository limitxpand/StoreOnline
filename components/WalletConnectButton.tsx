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

// Inner component to safely use hooks after initialization
function InnerWalletButton({ 
  price,
  cryptoCurrency,
  adminWalletAddress, 
  onSuccess 
}: { 
  price: number;
  cryptoCurrency: string;
  adminWalletAddress: string;
  onSuccess: (txHash: string) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

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

      let txHash = '';

      if (cryptoCurrency === 'USDT') {
        // Enforce Binance Smart Chain (chainId 56)
        if (chainId !== 56) {
          alert('Please switch your wallet to Binance Smart Chain (BSC) to pay with BEP20 USDT.');
          open({ view: 'Networks' });
          setIsProcessing(false);
          return;
        }

        // BEP20 USDT Contract Address
        const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
        
        // Minimal ABI for ERC20 transfer
        const erc20Abi = [
          "function transfer(address to, uint256 amount) returns (bool)",
          "function decimals() view returns (uint8)"
        ];
        
        const { Contract } = await import('ethers');
        const usdtContract = new Contract(USDT_ADDRESS, erc20Abi, signer);
        
        // USDT on BSC uses 18 decimals
        const amountToPay = parseUnits(price.toString(), 18);
        
        console.log('Initiating USDT Transfer...');
        const tx = await usdtContract.transfer(adminWalletAddress, amountToPay);
        console.log('USDT Transaction sent:', tx.hash);
        await tx.wait(1);
        txHash = tx.hash;

      } else {
        // Native Transfer (BNB or ETH)
        // Basic calculation for demo
        let demoPriceStr = price.toString();
        if (price > 10) {
          demoPriceStr = (price / 1000).toFixed(4); // just for safe demo purposes
        }

        const tx = await signer.sendTransaction({
          to: adminWalletAddress,
          value: parseUnits(demoPriceStr, 18)
        });

        console.log('Transaction sent:', tx.hash);
        await tx.wait(1);
        txHash = tx.hash;
      }

      onSuccess(txHash);
    } catch (err: any) {
      console.error("Payment failed", err);
      alert("Payment failed or was rejected. " + (err.message || ''));
    } finally {
      setIsProcessing(false);
    }
  };

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

// Outer wrapper to handle initialization
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!walletConnectProjectId) return;
    
    if (!web3ModalInitialized) {
      try {
        createWeb3Modal({
          ethersConfig: defaultConfig({ metadata }),
          chains: [mainnet, bsc],
          projectId: walletConnectProjectId,
          enableAnalytics: false
        });
        web3ModalInitialized = true;
      } catch (err) {
        console.error("Failed to initialize Web3Modal", err);
      }
    }
    setInitialized(true);
  }, [walletConnectProjectId]);

  if (!initialized) {
    return (
      <button 
        disabled
        style={{
          background: '#374151',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          cursor: 'not-allowed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          marginTop: '1rem'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>⏳</span> Loading Crypto Gateway...
      </button>
    );
  }

  return (
    <InnerWalletButton 
      price={price}
      cryptoCurrency={cryptoCurrency}
      adminWalletAddress={adminWalletAddress}
      onSuccess={onSuccess}
    />
  );
}
