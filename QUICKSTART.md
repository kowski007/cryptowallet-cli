# Quick Start Guide - Wallet Generator Web UI

Get up and running with the Crypto Wallet Generator in 2 minutes!

## Prerequisites
- Node.js 18 or higher
- npm, pnpm, yarn, or bun

## Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser to http://localhost:3000
```

That's it! You're ready to generate wallets.

## Basic Usage (5 Steps)

### Step 1: Select a Blockchain
Click the "Blockchain" dropdown and choose from 30+ options:
- Bitcoin (BTC)
- Ethereum (ETH)
- Solana (SOL)
- And more...

### Step 2: Choose Number of Wallets
Use the slider or type a number (1-100):
- Slider: Drag to adjust
- Input: Type directly and press Enter

### Step 3: (Optional) Select Address Format
If your blockchain supports multiple formats, choose one:
- Bitcoin has: legacy, segwit, bech32, taproot
- Binance has: bep2, bep20, erc20
- Most others have: default

### Step 4: (Optional) Import a Mnemonic
Paste a 12-24 word BIP39 mnemonic to derive addresses from it.
Leave blank to generate new random mnemonics.

### Step 5: Generate!
Click **"Generate Wallets"** and wait for results.

## Getting Your Results

Once wallets are generated:

### View Results
- **Show Mnemonics**: Check this to see seed phrases
- **Copy**: Click "Copy" button to copy any address
- **Scroll**: If many wallets, scroll to see more

### Export to File

**CSV Format** (for Excel/Google Sheets):
```
Click "Export as CSV"
↓
Opens file: wallets-btc-[timestamp].csv
↓
Has columns: Address, Mnemonic, Derivation Path, Format
```

**TXT Format** (easy to read):
```
Click "Export as TXT"
↓
Opens file: wallets-btc-[timestamp].txt
↓
Human-readable format with headers and wallet info
```

## Common Use Cases

### Classroom / Educational Setup
Generate 50 wallets for 50 students:
1. Select any blockchain (Bitcoin recommended)
2. Set count to 50
3. Click Generate
4. Export as CSV
5. Share CSV file with students

### Multiple Blockchain Demo
Generate wallets for different blockchains:
1. Generate 10 Bitcoin wallets
2. Export and save
3. Change blockchain to Ethereum
4. Generate 10 Ethereum wallets
5. Export and combine files

### Testing with Custom Mnemonic
Test with a known mnemonic:
1. Paste your mnemonic in the textarea
2. Set count to 1
3. Generate
4. Verify addresses match expected derivation

## Keyboard Shortcuts

- **Enter** on wallet count field: Generate wallets
- **Ctrl/Cmd + C**: Copy address (after clicking Copy button)

## Tips & Tricks

### Speed Up Generation
- Generate wallets in batches of 10-20 instead of 100
- Multiple smaller batches = easier to manage

### Backup Important Data
- Always save your CSV/TXT exports
- Keep backups in secure location
- Never share wallet mnemonics

### Verify Results
- Compare exported addresses with web interface
- Check mnemonic validity before deriving many addresses
- Test with small batches first

## Troubleshooting

### "Blockchain not loading"
- Refresh the page (F5 or Cmd+R)
- Check browser console for errors

### Generation takes too long
- Wait up to 30 seconds for 100 wallets
- Generate fewer wallets (50 or less) for faster results
- Check your internet connection

### Export didn't work
- Ensure wallets were successfully generated
- Try exporting in different format (CSV vs TXT)
- Check browser's download folder

### Can't copy address
- Click the Copy button (not the address itself)
- Watch for "✓ Copied" confirmation
- Address is now in your clipboard

## For Developers

### Environment Setup
```bash
# Install
npm install

# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure
- `/app` - Next.js app (pages, API routes, components)
- `/src` - Wallet generation logic (unchanged from CLI)
- `/public` - Static files
- `/app/api` - API endpoints
- `/app/components` - React components

### Customizing Styling
Edit `tailwind.config.ts` or `app/globals.css` to change:
- Colors
- Typography
- Spacing
- Responsive breakpoints

### Adding Features
1. Create new component in `app/components/`
2. Add API route in `app/api/feature/route.ts`
3. Integrate in `app/page.tsx`

## Production Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
- **AWS**: Build with `npm run build`, deploy to Lambda/ECS
- **Docker**: Create Dockerfile, deploy to any container service
- **Self-hosted**: `npm run build && npm start`

## Need Help?

1. **Check WEB_UI.md** - Full documentation
2. **Check browser console** - Error messages
3. **Check terminal output** - Server logs
4. **GitHub Issues** - Report bugs

## Quick Reference

| Action | Steps |
|--------|-------|
| Generate 10 BTC wallets | Select BTC → Set count to 10 → Generate |
| Export as CSV | Generate → Click "Export as CSV" → Save file |
| Use custom mnemonic | Paste in textarea → Set count → Generate |
| Change blockchain | Select new chain → Formats update → Generate |
| Copy address | Generate → Click "Copy" button → Paste anywhere |

---

**Ready?** Just run `npm run dev` and start generating wallets!
