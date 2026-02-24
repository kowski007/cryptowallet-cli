import { NextRequest, NextResponse } from 'next/server';
import CW from '../../../src/CW.js';

export const runtime = 'nodejs';
export const maxDuration = 120;

interface GenerateRequest {
  chain: string;
  count: number;
  format?: string;
  mnemonic?: string;
}

interface GeneratedWallet {
  address: string;
  mnemonic?: string;
  derivationPath?: string;
  format: string;
  privateKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { chain, count, format, mnemonic } = body;

    // Validate input
    if (!chain || typeof chain !== 'string') {
      return NextResponse.json(
        { error: 'Chain is required' },
        { status: 400 }
      );
    }

    if (!count || typeof count !== 'number' || count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 100' },
        { status: 400 }
      );
    }

    const wallets: GeneratedWallet[] = [];

    // Generate wallets sequentially
    for (let i = 0; i < count; i++) {
      try {
        const options: any = {
          count: 1,
          mnemonic: mnemonic,
        };

        if (format) {
          options.format = format;
        }

        const cw = new CW(chain, options);
        const wallet = await cw.init();

        if (wallet) {
          wallets.push({
            address: wallet.address || '',
            mnemonic: wallet.mnemonic || undefined,
            derivationPath: wallet.derivationPath || undefined,
            format: wallet.format || format || 'default',
            privateKey: wallet.privateKey || undefined,
          });
        }
      } catch (walletError) {
        console.error(`Error generating wallet ${i + 1}:`, walletError);
        // Continue with next wallet instead of failing entire request
        continue;
      }
    }

    if (wallets.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any wallets' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      chain,
      format: format || 'default',
      count: wallets.length,
      wallets,
    });
  } catch (error) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Generation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
