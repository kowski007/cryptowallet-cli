'use client';

import { useState, useCallback } from 'react';
import GenerationForm from './components/GenerationForm';
import WalletGrid from './components/WalletGrid';

interface Wallet {
  address: string;
  mnemonic?: string;
  derivationPath?: string;
  format?: string;
}

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [chain, setChain] = useState('');
  const [format, setFormat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = useCallback(
    async (data: {
      chain: string;
      count: number;
      format: string;
      mnemonic?: string;
    }) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Generation failed');
        }

        const result = await response.json();
        setWallets(result.wallets);
        setChain(result.chain);
        setFormat(result.format);
        showToast(`Successfully generated ${result.count} wallet(s)!`, 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Generation failed';
        showToast(errorMessage, 'error');
        console.error('Generation error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleExport = useCallback(
    async (exportFormat: 'csv' | 'txt') => {
      if (wallets.length === 0) {
        showToast('No wallets to export', 'error');
        return;
      }

      setIsExporting(true);
      try {
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallets,
            chain,
            format: exportFormat,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Export failed');
        }

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `wallets-${chain.toLowerCase()}-${Date.now()}.${exportFormat}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match) filename = match[1];
        }

        // Download file
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Exported ${wallets.length} wallet(s) as ${exportFormat.toUpperCase()}`, 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';
        showToast(errorMessage, 'error');
        console.error('Export error:', error);
      } finally {
        setIsExporting(false);
      }
    },
    [wallets, chain]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Crypto Wallet Generator
            </h1>
            <p className="text-gray-600 mt-1">
              Generate multiple cryptocurrency wallets for Bitcoin, Ethereum, Solana, and 30+ blockchains
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <GenerationForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {wallets.length > 0 ? (
              <WalletGrid
                wallets={wallets}
                chain={chain}
                format={format}
                onExport={handleExport}
                isExporting={isExporting}
              />
            ) : (
              <div className="card p-12 text-center">
                <div className="text-gray-400 mb-4 text-5xl">📋</div>
                <p className="text-gray-600 text-lg">
                  Select a blockchain and generate wallets to get started
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  You can generate up to 100 wallets at once and export them as CSV or TXT
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}
    </main>
  );
}
