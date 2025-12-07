# 🍔 Burger Box dApp

A blockchain-based challenge game where users cook the perfect burger with exact ingredients to earn a flag on the IOTA blockchain.

## 🎮 Game Objective

Cook a burger with the **exact correct ingredients**:
- 🍞 Buns: 2
- 🥩 Beef: 1
- 🧀 Cheese: 3
- 🥬 Lettuce: 4
- 🍅 Tomato: 5
- 🍯 Sauce: 6
- 🥒 Pickles: 8

When you submit the perfect recipe, you'll earn a **Flag NFT** on the blockchain! 🚩

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Deploy the smart contract
npm run iota-deploy

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect your IOTA wallet to start playing!

## 📚 Documentation

For detailed setup instructions, see **[INSTRUCTION_GUIDE.md](./INSTRUCTION_GUIDE.md)**

## 🎯 Features

- ✅ Wallet connection with IOTA dApp Kit
- ✅ Move smart contract for burger validation
- ✅ Interactive UI to input burger ingredients
- ✅ Real-time blockchain transaction tracking
- ✅ Flag NFT reward system
- ✅ Error handling and loading states
- ✅ TypeScript support
- ✅ Modern glassmorphism UI design

## 🏗️ Architecture

### Smart Contract (`Move`)
Located in `contract/pizza_box/sources/pizza_box.move`:
- **`cook()`** - Creates a burger box with ingredients
- **`get_flag()`** - Validates ingredients and mints flag NFT

### Frontend (`React + Next.js`)
- **`components/sample.tsx`** - Main game interface
- **`hooks/useContract.ts`** - Smart contract interaction logic
- **`lib/config.ts`** - Configuration and package IDs

## 📁 Project Structure

```
├── app/                          # Next.js app directory
├── components/
│   ├── sample.tsx               # Main Burger Box game UI
│   ├── Provider.tsx             # IOTA dApp Kit provider
│   └── Wallet-connect.tsx       # Wallet connection button
├── hooks/
│   └── useContract.ts           # Contract logic & state management
├── lib/
│   └── config.ts                # Network & package configuration
├── contract/pizza_box/
│   └── sources/
│       └── pizza_box.move       # Smart contract
├── public/                       # Static assets
└── scripts/                      # Deployment scripts
```

## 🔧 How It Works

1. **Connect Wallet** - User connects their IOTA wallet
2. **Set Ingredients** - User inputs burger ingredient amounts
3. **Cook Burger** - Transaction is sent to blockchain
4. **Smart Contract** - Contract creates BurgerBox object
5. **Submit for Flag** - User submits burger for validation
6. **Get Flag** - If ingredients match, user receives Flag NFT

## 🌐 Networks

- **Devnet**: Default network for testing
- **Testnet**: Community testing network
- **Mainnet**: Production deployment

Update your network in `lib/config.ts`

## 📚 Learn More

- [IOTA Documentation](https://wiki.iota.org/)
- [IOTA dApp Kit](https://github.com/iotaledger/dapp-kit)
- [Move Language](https://move-language.github.io/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🛠️ Development

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy contract
npm run iota-deploy

# Generate types from contract
npm run iota-generate-prompt
```

## 📄 License

MIT
