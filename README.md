# RoomieGO Blockchain

This directory contains the smart contracts and blockchain-related code for the RoomieGO platform.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example` and fill in your values:

```bash
cp .env.example .env
```

3. Compile contracts:

```bash
npm run compile
```

4. Run tests:

```bash
npm test
```

## Development

### Local Development

1. Start a local Hardhat node:

```bash
npx hardhat node
```

2. Deploy contracts to local network:

```bash
npm run deploy
```

### Testnet Deployment

1. Deploy to Goerli testnet:

```bash
npm run deploy:testnet
```

### Mainnet Deployment

1. Deploy to Ethereum mainnet:

```bash
npm run deploy:mainnet
```

## Smart Contracts

### RentalContract

The main smart contract for managing rental agreements between room owners and tenants.

Features:

- Create rental contracts
- Make payments
- Terminate contracts
- View contract details
- Track payment history

## Testing

The test suite includes:

- Contract creation tests
- Payment processing tests
- Contract termination tests
- Access control tests

## Security

- ReentrancyGuard for payment functions
- Access control for contract termination
- Input validation for all functions
- Event emission for important actions

## Integration with Backend

The backend service communicates with the smart contract through Web3j. Make sure to:

1. Update the contract address in the backend configuration
2. Configure the appropriate network (mainnet/testnet/local)
3. Set up the wallet private key for transactions
