'use client';

import { useState } from 'react';

interface Wallet {
  address: string;
  mnemonic?: string;
  derivationPath?: string;
  format?: string;
}

interface WalletGridProps {
  wallets: Wallet[];
  chain: string;
  format: string;
  onExport: (exportFormat: 'csv' | 'txt') => Promise<void>;
  isExporting?: boolean;
}

export default function WalletGrid({
  wallets,
  chain,
  format,
  onExport,
  isExporting = false,
}: WalletGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showMnemonics, setShowMnemonics] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-gray-700">
          Generated <strong>{wallets.length}</strong> wallet(s) for <strong>{chain.toUpperCase()}</strong>
          {format && format !== 'default' && ` • Format: ${format}`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMnemonics}
            onChange={(e) => setShowMnemonics(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">Show Mnemonics</span>
        </label>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onExport('csv')}
          disabled={isExporting}
          className="btn btn-primary"
        >
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </button>
        <button
          onClick={() => onExport('txt')}
          disabled={isExporting}
          className="btn btn-secondary"
        >
          {isExporting ? 'Exporting...' : 'Export as TXT'}
        </button>
      </div>

      {/* Wallets Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                {showMnemonics && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mnemonic</th>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                      {wallet.address}
                    </code>
                  </td>
                  {showMnemonics && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {wallet.mnemonic ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                          {wallet.mnemonic}
                        </code>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => copyToClipboard(wallet.address, index)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        copiedIndex === index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {copiedIndex === index ? '✓ Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="text-sm text-gray-600">
        Displaying {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
