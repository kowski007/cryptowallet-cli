# Crypto Wallet Generator - Web UI Documentation

## Overview

The Web UI is a modern, user-friendly interface for generating cryptocurrency wallets in batch. It's built with Next.js, React, and Tailwind CSS, making it perfect for classroom environments and teams.

## Features

### Core Functionality
- **Batch Wallet Generation**: Generate 1-100 wallets in a single operation
- **Multi-Chain Support**: 30+ supported blockchains including Bitcoin, Ethereum, Solana, TON, and more
- **Multiple Address Formats**: Support for different address formats per blockchain (e.g., Bitcoin's legacy, segwit, bech32, taproot)
- **Custom Mnemonics**: Import existing BIP39 mnemonics or generate new ones
- **Export Options**: Download results as CSV or TXT files

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Validation**: Input validation with helpful error messages
- **Copy to Clipboard**: Quick copy functionality for individual wallet addresses
- **Loading Indicators**: Visual feedback during wallet generation
- **Mnemonic Display Toggle**: Show/hide mnemonics for security and readability

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, yarn, or bun package manager

### Installation

1. Clone and install dependencies:
```bash
git clone https://github.com/yerofey/cryptowallet-cli.git
cd cryptowallet-cli
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Production Deployment

Build and start the production server:
```bash
npm run build
npm start
```

Or deploy to Vercel with a single click:
```bash
# Login to Vercel and connect your repository
vercel
```

## Usage Guide

### Generating Wallets

1. **Select Blockchain**: Choose from the dropdown (BTC, ETH, SOL, TON, etc.)
2. **Select Format** (if available): Some blockchains offer multiple address formats
3. **Set Wallet Count**: Use the slider or input box to specify 1-100 wallets
4. **Add Mnemonic** (optional): Paste a 12-24 word BIP39 mnemonic to derive addresses from it
5. **Click Generate**: The system will generate your wallets and display them below

### Exporting Results

After generating wallets:
1. **Toggle Mnemonics** (optional): Check "Show Mnemonics" to display seed phrases
2. **Choose Format**: 
   - **CSV**: Best for importing into spreadsheets (Excel, Google Sheets)
   - **TXT**: Human-readable format, easy to review
3. **Click Export**: The file will download automatically

### Copying Addresses

- Click the "Copy" button on any wallet row to copy the address to your clipboard
- The button will show "✓ Copied" for confirmation

## API Reference

The Web UI uses three main API endpoints:

### GET `/api/chains`
Returns a list of all supported blockchains with their formats.

**Response:**
```json
{
  "chains": [
    {
      "symbol": "BTC",
      "title": "Bitcoin",
      "formats": ["default", "legacy", "segwit", "bech32", "taproot"],
      "defaultFormat": "default"
    },
    ...
  ]
}
```

### POST `/api/generate`
Generates wallets for a specific blockchain.

**Request:**
```json
{
  "chain": "BTC",
  "count": 5,
  "format": "bech32",
  "mnemonic": "optional 12-24 word mnemonic" // optional
}
```

**Response:**
```json
{
  "success": true,
  "chain": "BTC",
  "format": "bech32",
  "count": 5,
  "wallets": [
    {
      "address": "bc1qar...",
      "mnemonic": "word1 word2 ...",
      "derivationPath": "m/84'/0'/0'/0/0",
      "format": "bech32"
    },
    ...
  ]
}
```

### POST `/api/export`
Exports wallet data to CSV or TXT format.

**Request:**
```json
{
  "wallets": [...],
  "chain": "BTC",
  "format": "csv"
}
```

**Response:** File download

## Project Structure

```
cryptowallet-cli/
├── app/
│   ├── api/
│   │   ├── chains/route.ts       # List supported chains
│   │   ├── generate/route.ts     # Generate wallets
│   │   └── export/route.ts       # Export to CSV/TXT
│   ├── components/
│   │   ├── ChainSelector.tsx     # Blockchain selector
│   │   ├── GenerationForm.tsx    # Wallet generation form
│   │   └── WalletGrid.tsx        # Results display grid
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── CW.js                     # Wallet orchestrator
    ├── Wallet.js                 # Wallet generation logic
    ├── Chain.js                  # Blockchain config loader
    ├── chains/                   # Blockchain configurations
    └── utils.js                  # Utilities
```

## Supported Blockchains

The web UI supports all blockchains in the cryptowallet-cli library:

### Major Networks
- **Bitcoin (BTC)** - Legacy, SegWit, Bech32, Taproot
- **Ethereum (ETH)** - ERC-20
- **Solana (SOL)**
- **The Open Network (TON)**
- **Binance Smart Chain (BNB)** - BEP2, BEP20, ERC20
- **Tron (TRON, TRX)**
- **Ripple (XRP)**

### Additional Networks
Bitcoin Cash, Litecoin, Dogecoin, Cardano, Polygon, Stellar, Sui, and 20+ others.

See `src/chains/` directory for complete list.

## Customization

### Styling
Edit `tailwind.config.ts` to customize colors, fonts, and spacing:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      'primary-dark': '#1e40af',
    },
  },
}
```

### Adding New Features
1. Create new components in `app/components/`
2. Add API routes in `app/api/[feature]/route.ts`
3. Update the main page (`app/page.tsx`) to use new features

## Security Considerations

- **Server-Side Processing**: All cryptographic operations happen on the server
- **No Private Key Storage**: The system generates addresses and mnemonics but never stores them
- **HTTPS Only**: Always use HTTPS in production
- **Input Validation**: All user inputs are validated on both client and server
- **Rate Limiting**: Consider implementing rate limiting for production deployments

## Troubleshooting

### Generation Timeout
If generating 100 wallets takes too long:
- The system has a 120-second timeout
- Try generating fewer wallets at once
- Check server CPU/memory resources

### Export Failed
- Ensure you have generated wallets first
- Check browser console for error details
- Verify the export format is 'csv' or 'txt'

### Import Mnemonic Not Working
- Verify the mnemonic is 12, 15, 18, 21, or 24 words
- Ensure words are space-separated
- Check that the mnemonic is valid BIP39

## Performance

- **Typical Generation Time**:
  - 1 wallet: < 1 second
  - 10 wallets: 2-3 seconds
  - 50 wallets: 10-15 seconds
  - 100 wallets: 20-30 seconds

- **Network**: Generation happens server-side, so only network latency + server processing time matters
- **Scalability**: For production use with many concurrent users, consider deploying to serverless platforms with auto-scaling

## Environment Variables

Create a `.env.local` file for development:
```
NODE_ENV=development
# Other variables as needed
```

For production, set environment variables in your deployment platform (Vercel, AWS, etc.)

## Support

For issues with the web UI or the underlying cryptowallet-cli library:
1. Check existing issues on GitHub
2. Create a detailed bug report with reproduction steps
3. Include system information (OS, Node version, browser)

## License

MIT - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.
