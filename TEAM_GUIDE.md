# Team Guide - Crypto Wallet Generator for School Class

This guide is designed for your team to use the wallet generator for your school class. Everything you need to know is here.

## For Teachers/Instructors

### Setup (Do This Once)

1. **Get the code**:
```bash
git clone https://github.com/yerofey/cryptowallet-cli.git
cd cryptowallet-cli
```

2. **Install and start**:
```bash
npm install
npm run dev
```

3. **Open in browser**: Go to `http://localhost:3000`

That's it! You're ready to generate wallets.

### Generating Wallets for Your Class

#### Scenario: You have 30 students, each needs a Bitcoin wallet

1. **Click the blockchain dropdown** → Select "Bitcoin (BTC)"
2. **Set wallet count** → Type or drag to "30"
3. **Keep other settings default** (unless students need specific mnemonics)
4. **Click "Generate Wallets"** → Wait 10-15 seconds
5. **Click "Export as CSV"** → Save the file
6. **Share the CSV with your class**:
   - Email the CSV file
   - Upload to learning management system (Blackboard, Canvas, etc.)
   - Share via Google Drive/OneDrive

### Understanding the Export Files

#### CSV Format (Open in Excel/Google Sheets)
```
Address,Mnemonic,Derivation Path,Format
bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq,word1 word2 ...,m/84'/0'/0'/0/0,bech32
```

- **Address**: The wallet address students use
- **Mnemonic**: The seed phrase (keep SECRET!)
- **Derivation Path**: Technical info (for advanced students)
- **Format**: Type of address (bech32 is modern Bitcoin)

#### TXT Format (Easy to Read)
```
Cryptocurrency Wallet Export
Chain: BTC
Generated: 2024-02-24T10:30:00Z
Total Wallets: 30
================================================================================

Wallet #1
Address: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
Mnemonic: word1 word2 word3 ...
Derivation Path: m/84'/0'/0'/0/0
Format: bech32

[More wallets...]
```

### Best Practices for Teaching

1. **Security First**:
   - Remind students these are educational wallets
   - Mnemonics should be treated like passwords
   - Never use real money with classroom wallets

2. **Version 1: No Mnemonics** (Privacy-focused)
   - Generate wallets without showing mnemonics to class
   - Export just addresses
   - Good for learning blockchain addresses without seed phrases

3. **Version 2: Show Mnemonics** (Full learning)
   - Generate with mnemonics visible
   - Show students how BIP39 mnemonic works
   - Explain derivation paths (m/84'/0'/0'/0/0)

4. **Version 3: Different Blockchains**
   - Generate 5 BTC wallets
   - Generate 5 ETH wallets  
   - Generate 5 SOL wallets
   - Students learn about different blockchain address formats

### Lesson Ideas

#### Lesson 1: What is a Wallet?
- Generate 1 Bitcoin wallet
- Show students the address
- Explain: address is like email, mnemonic is like password

#### Lesson 2: Blockchain Formats
- Show BTC supports 4 formats (legacy, segwit, bech32, taproot)
- Generate 4 addresses with each format
- Discuss historical evolution
- bech32 is modern, smallest transaction fees

#### Lesson 3: HD Wallets (Advanced)
- Generate 10 wallets
- Show derivation paths (m/44'/0'/0'/0/0, m/44'/0'/0'/0/1, etc.)
- Explain: one mnemonic → many addresses
- This is how real wallets work

#### Lesson 4: Export & Import
- Export to CSV
- Import into spreadsheet
- Create charts of addresses
- Learn data management

## For Students

### What is This?

A tool to generate cryptocurrency wallet addresses. Think of it like creating a bank account number - but for crypto!

### How to Use Your Wallet

1. **Find your wallet address**: It's a long string starting with "bc1" (Bitcoin)
2. **Share this address**: Tell friends to send you crypto here
3. **Keep mnemonic secret**: Like a password for recovering your wallet
4. **Never share mnemonic**: If someone gets it, they can steal from you

### Understanding Your Wallet Info

If your teacher provided a CSV with this info:

```
Address: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
Mnemonic: abandon ability able about above absolute abuse access accident account accuse
```

- **Address**: Use this to receive money (like your account number)
- **Mnemonic**: Only you should know this (like your password)
- **Derivation Path**: Technical detail, not important to understand yet

### Activities You Might Do

1. **Track a transaction**: Send crypto between class wallets using blockchain explorer
2. **Calculate fees**: Different blockchains cost different amounts to transfer
3. **Learn about formats**: Bitcoin has 4 types, Ethereum has 1 type
4. **Understand hashing**: Look up your address on blockchain.com or etherscan.io

### Vocabulary

- **Wallet**: Your account on a blockchain
- **Address**: Your account number (like IBAN for crypto)
- **Mnemonic**: Recovery phrase (12-24 words that regenerate your wallet)
- **Private Key**: Secret key that proves you own the wallet
- **Blockchain**: Public ledger of all transactions

## For Developers/Tech Staff

### System Requirements

- Node.js 18+ (check: `node --version`)
- npm/pnpm/yarn/bun (comes with Node.js)
- ~500MB disk space
- Any modern browser (Chrome, Firefox, Safari, Edge)

### Local Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Customization

**Change colors** (`tailwind.config.ts`):
```typescript
colors: {
  primary: '#3b82f6',        // Blue - change this
  'primary-dark': '#1e40af', // Dark blue - change this
}
```

**Add new blockchain** (if not supported):
1. Create `src/chains/SYMBOL.json`
2. Add wallet generation logic to `src/Wallet.js`
3. Test and verify

**Change the UI layout** (`app/page.tsx`):
- Modify grid layout
- Change colors
- Rearrange components
- Add new components

### Deployment for Your School

#### Option A: Vercel (Easiest)
```bash
npm install -g vercel
vercel login
vercel
# Your app is live at https://wallet-generator.vercel.app
```

#### Option B: School Server
```bash
# On school server
npm install
npm run build

# Use PM2 to keep running
npm install -g pm2
pm2 start npm --name wallet -- start
pm2 startup
pm2 save
```

#### Option C: Docker Container
```bash
docker build -t wallet-generator .
docker run -p 3000:3000 wallet-generator
```

### Testing the API

Using curl or Postman:

```bash
# Get supported chains
curl http://localhost:3000/api/chains

# Generate 5 Bitcoin wallets
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "chain": "BTC",
    "count": 5,
    "format": "bech32"
  }'

# Export as CSV
curl -X POST http://localhost:3000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "wallets": [...],
    "chain": "BTC",
    "format": "csv"
  }'
```

### Troubleshooting

#### "Port 3000 is already in use"
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
# Then run: npm run dev
```

#### "npm install fails"
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### "Build fails"
```bash
# Full clean rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Generation is slow
- Check CPU/memory on server
- Generation takes 20-30s for 100 wallets
- This is expected!

### Security Notes

- All crypto operations happen on server
- No private keys sent to browser
- Addresses and mnemonics only transmitted in POST/response
- Use HTTPS in production (Vercel does automatically)
- No database of wallets (stateless)
- No authentication needed (for school demo)

### Adding Authentication (If Needed)

```typescript
// app/api/generate/route.ts - add this check
const apiKey = request.headers.get('x-api-key');
if (apiKey !== process.env.API_KEY) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Then require `x-api-key` header in requests.

## Troubleshooting for Your Team

### "App won't start"
1. Check Node.js version: `node --version` (should be 18+)
2. Clear cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules && npm install`
4. Try again: `npm run dev`

### "Port already in use"
Stop other servers using port 3000, or use different port:
```bash
npm run dev -- -p 3001
```

### "Wallets not generating"
1. Check browser console for errors
2. Check terminal output for server logs
3. Try selecting different blockchain
4. Try fewer wallets (e.g., 1 instead of 100)

### "Export not working"
1. Make sure wallets generated successfully
2. Try different format (CSV vs TXT)
3. Check browser settings allow downloads
4. Try incognito/private mode

### "Slow generation with 100 wallets"
This is normal! Takes 20-30 seconds per 100 wallets due to cryptographic operations.
Not a bug - it's how cryptography works.

## Quick Reference

| Task | Command |
|------|---------|
| Start development | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm start` |
| Install dependencies | `npm install` |
| Generate 30 BTC wallets | Select BTC, set 30, click Generate |
| Export as CSV | Generate, click "Export as CSV" |
| Deploy to Vercel | `npm install -g vercel && vercel` |

## Getting Help

1. **Check documentation**:
   - `WEB_UI.md` - Full feature documentation
   - `QUICKSTART.md` - Quick start guide
   - `DEPLOYMENT.md` - Deployment options

2. **Check terminal output**:
   - Errors are printed when you run `npm run dev`
   - Browser console (F12) shows client-side errors

3. **Ask a question**:
   - Check existing GitHub issues
   - Create new issue with error message and steps to reproduce

## Tips for Success

✅ **For Teachers**:
- Test generating wallets yourself first
- Have students generate 1 wallet before going to larger batches
- Show students the CSV export to demystify data
- Use different blockchains to show blockchain diversity

✅ **For Students**:
- Ask your teacher to explain your wallet before using it
- Don't share your mnemonic with anyone
- These are educational wallets - they're learning tools

✅ **For IT/Developers**:
- Keep Node.js updated
- Use Vercel for easiest deployment
- Monitor server resources if hosting locally
- Back up any important configuration

## Summary

You now have a complete wallet generation system that:
- ✅ Works for classroom use
- ✅ Supports 30+ blockchains
- ✅ Generates up to 100 wallets at once
- ✅ Exports to CSV and TXT
- ✅ Is easy to understand and use
- ✅ Can be deployed anywhere

**Ready to go?** Run `npm run dev` and start generating wallets!

Questions? Check WEB_UI.md or QUICKSTART.md.
