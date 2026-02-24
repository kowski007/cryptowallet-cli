import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crypto Wallet Generator',
  description: 'Generate multiple cryptocurrency wallets for Bitcoin, Ethereum, Solana, and 30+ other blockchains',
  keywords: ['wallet', 'crypto', 'bitcoin', 'ethereum', 'generator'],
  openGraph: {
    title: 'Crypto Wallet Generator',
    description: 'Generate multiple cryptocurrency wallets for educational purposes',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
