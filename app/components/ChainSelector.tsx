'use client';

import { useEffect, useState } from 'react';

interface Chain {
  symbol: string;
  title: string;
  formats: string[];
  defaultFormat: string;
}

interface ChainSelectorProps {
  selectedChain: string;
  selectedFormat: string;
  onChainChange: (chain: string) => void;
  onFormatChange: (format: string) => void;
  disabled?: boolean;
}

export default function ChainSelector({
  selectedChain,
  selectedFormat,
  onChainChange,
  onFormatChange,
  disabled = false,
}: ChainSelectorProps) {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChains = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/chains');
        if (!response.ok) throw new Error('Failed to fetch chains');
        
        const data = await response.json();
        setChains(data.chains);
        
        // Set default chain if not selected
        if (!selectedChain && data.chains.length > 0) {
          const defaultChain = data.chains.find((c: Chain) => c.symbol === 'BTC') || data.chains[0];
          onChainChange(defaultChain.symbol);
          onFormatChange(defaultChain.defaultFormat);
        }
      } catch (err) {
        setError('Failed to load chains');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, [selectedChain, onChainChange, onFormatChange]);

  const currentChain = chains.find(c => c.symbol === selectedChain);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blockchain
          </label>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="chain-select" className="block text-sm font-medium text-gray-700 mb-2">
          Blockchain
        </label>
        <select
          id="chain-select"
          value={selectedChain}
          onChange={(e) => {
            const chain = chains.find(c => c.symbol === e.target.value);
            onChainChange(e.target.value);
            if (chain) {
              onFormatChange(chain.defaultFormat);
            }
          }}
          disabled={disabled}
          className="select"
        >
          <option value="">Select a blockchain...</option>
          {chains.map(chain => (
            <option key={chain.symbol} value={chain.symbol}>
              {chain.title} ({chain.symbol})
            </option>
          ))}
        </select>
      </div>

      {currentChain && currentChain.formats.length > 1 && (
        <div>
          <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-2">
            Address Format
          </label>
          <select
            id="format-select"
            value={selectedFormat}
            onChange={(e) => onFormatChange(e.target.value)}
            disabled={disabled}
            className="select"
          >
            {currentChain.formats.map(fmt => (
              <option key={fmt} value={fmt}>
                {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
