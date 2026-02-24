import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface Wallet {
  address: string;
  mnemonic?: string;
  derivationPath?: string;
  format?: string;
  privateKey?: string;
}

interface ExportRequest {
  wallets: Wallet[];
  chain: string;
  format: 'csv' | 'txt';
}

function generateCSV(wallets: Wallet[], chain: string): string {
  // CSV Headers
  const headers = ['Address', 'Mnemonic', 'Derivation Path', 'Format'];
  const rows = [headers.join(',')];

  // Add wallet rows
  wallets.forEach(wallet => {
    const row = [
      `"${wallet.address}"`,
      wallet.mnemonic ? `"${wallet.mnemonic}"` : '',
      wallet.derivationPath ? `"${wallet.derivationPath}"` : '',
      wallet.format || 'default',
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

function generateTXT(wallets: Wallet[], chain: string): string {
  let content = `Cryptocurrency Wallet Export\n`;
  content += `Chain: ${chain.toUpperCase()}\n`;
  content += `Generated: ${new Date().toISOString()}\n`;
  content += `Total Wallets: ${wallets.length}\n`;
  content += `${'='.repeat(80)}\n\n`;

  wallets.forEach((wallet, index) => {
    content += `Wallet #${index + 1}\n`;
    content += `Address: ${wallet.address}\n`;
    if (wallet.mnemonic) {
      content += `Mnemonic: ${wallet.mnemonic}\n`;
    }
    if (wallet.derivationPath) {
      content += `Derivation Path: ${wallet.derivationPath}\n`;
    }
    if (wallet.format) {
      content += `Format: ${wallet.format}\n`;
    }
    content += `\n`;
  });

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    const { wallets, chain, format } = body;

    // Validate input
    if (!Array.isArray(wallets) || wallets.length === 0) {
      return NextResponse.json(
        { error: 'No wallets to export' },
        { status: 400 }
      );
    }

    if (!chain || typeof chain !== 'string') {
      return NextResponse.json(
        { error: 'Chain is required' },
        { status: 400 }
      );
    }

    if (!format || !['csv', 'txt'].includes(format)) {
      return NextResponse.json(
        { error: 'Format must be csv or txt' },
        { status: 400 }
      );
    }

    let fileContent: string;
    let mimeType: string;
    let filename: string;

    if (format === 'csv') {
      fileContent = generateCSV(wallets, chain);
      mimeType = 'text/csv;charset=utf-8';
      filename = `wallets-${chain.toLowerCase()}-${Date.now()}.csv`;
    } else {
      fileContent = generateTXT(wallets, chain);
      mimeType = 'text/plain;charset=utf-8';
      filename = `wallets-${chain.toLowerCase()}-${Date.now()}.txt`;
    }

    const response = new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

    return response;
  } catch (error) {
    console.error('Export error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Export failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
