'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import ChainSelector from './ChainSelector';

interface GenerationFormProps {
  onGenerate: (data: {
    chain: string;
    count: number;
    format: string;
    mnemonic?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function GenerationForm({
  onGenerate,
  isLoading = false,
}: GenerationFormProps) {
  const [selectedChain, setSelectedChain] = useState('BTC');
  const [selectedFormat, setSelectedFormat] = useState('default');
  const [walletCount, setWalletCount] = useState(1);
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedChain) {
      setError('Please select a blockchain');
      return;
    }

    if (walletCount < 1 || walletCount > 100) {
      setError('Wallet count must be between 1 and 100');
      return;
    }

    try {
      await onGenerate({
        chain: selectedChain,
        count: walletCount,
        format: selectedFormat,
        mnemonic: mnemonic || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    }
  };

  const handleCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
    setWalletCount(value);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Generate Wallets
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <ChainSelector
        selectedChain={selectedChain}
        selectedFormat={selectedFormat}
        onChainChange={setSelectedChain}
        onFormatChange={setSelectedFormat}
        disabled={isLoading}
      />

      <div>
        <label htmlFor="wallet-count" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Wallets
        </label>
        <div className="space-y-2">
          <input
            id="wallet-count"
            type="number"
            min="1"
            max="100"
            value={walletCount}
            onChange={handleCountChange}
            disabled={isLoading}
            className="input"
          />
          <input
            type="range"
            min="1"
            max="100"
            value={walletCount}
            onChange={(e) => setWalletCount(parseInt(e.target.value))}
            disabled={isLoading}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-xs text-gray-500">
            Generating {walletCount} wallet{walletCount !== 1 ? 's' : ''} may take a few seconds
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-700 mb-2">
          BIP39 Mnemonic (Optional)
        </label>
        <textarea
          id="mnemonic"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          disabled={isLoading}
          placeholder="Leave empty to generate new mnemonics, or paste a 12-24 word BIP39 mnemonic..."
          className="input min-h-24 font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          If provided, wallets will be derived from this mnemonic instead of generating new ones
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full text-lg py-3 font-semibold"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating Wallets...
          </span>
        ) : (
          'Generate Wallets'
        )}
      </button>
    </form>
  );
}
