# **stacchain**

## Smart Contracts for the STAC Ecosystem

This repository contains smart contracts for the **STAC Ecosystem**, including:

- **STACToken**: An ERC20 token for the STAC ecosystem.
- **STACAccessKey**: A smart contract for purchasing access keys to geospatial data collections using blockchain technology.

## **Security Warning**

1. **Private Keys**:

   - Never share or hardcode your private keys in the repository or any script. Use environment variables stored in a `.env` file, which is excluded from version control.
   - Ensure the `.env` file is secure and accessible only to authorized users.

2. **Mainnet Deployment**:

   - Be extra cautious when deploying contracts to the **Polygon mainnet**. Test thoroughly on the **Mumbai testnet** before deploying to the mainnet.
   - Mistakes on the mainnet can result in irreversible loss of funds.

3. **Mumbai Testnet**:

   - The **Mumbai testnet** is a safe environment for testing deployments and interactions. Use free MATIC from a [Mumbai Faucet](https://faucet.polygon.technology/) to fund your wallet for testing.

4. **Gas Fees**:
   - Transactions on Polygon require **MATIC** for gas fees. Ensure your wallet has enough MATIC to cover the gas costs for deployments and interactions.

## Features

- **STACToken**:
  - ERC20-compliant token implemented using OpenZeppelin.
  - Minted with an initial supply of 1,000,000 tokens.
- **STACAccessKey**:
  - Allows users to purchase access keys by sending cryptocurrency.
  - Emits events for integration with external systems.
  - Admin controls for revoking access and updating prices.

---

## Repository Structure

```plaintext
smart-contracts/
├── contracts/
│   ├── STACToken.sol        # ERC20 token contract
│   ├── STACAccessKey.sol    # Access key contract
├── scripts/
│   ├── deploySTACToken.js   # Deployment script for STACToken
│   ├── deployAccessKey.js   # Deployment script for STACAccessKey
├── test/
│   ├── STACToken.test.js    # Tests for STACToken
│   ├── STACAccessKey.test.js # Tests for STACAccessKey
├── hardhat.config.js        # Hardhat configuration
├── package.json             # Project dependencies and scripts
├── .env                     # Environment variables (excluded from version control)
├── README.md                # Documentation
└── LICENSE                  # Licensing information
```

## Prerequisites

To use this repository, ensure you have the following installed:

- Node.js (v16+ recommended)
- Hardhat
- A Polygon-compatible wallet like MetaMask
- A funded account with MATIC (for gas fees) on the Polygon Mumbai testnet or mainnet.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-contracts.git
cd smart-contracts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project and populate it with the necessary environment variables:

```plaintext
MUMBAI_PRIVATE_KEY=private-key-mumbai-test-net
POLYGON_PRIVATE_KEY=private-key-polygon-network
POLYGONSCAN_API_KEY=polygonscan-api-key
```

### 4. Compile the Contracts

Compile the smart contracts to generate artifacts:

```bash
npx hardhat compile
```

## Usage

### Deploy Contracts

- Deploy `STACToken` (ERC20 Token)

```bash
npx hardhat run scripts/deploySTACToken.js --network mumbai
```

- Deploy `STACAccessKey` (Access Key Contract)

```bash
npx hardhat run scripts/deployAccessKey.js --network mumbai
```

Note: Replace `mumbai` with `polygon` for deploying to the mainnet.

### Run Tests

Test the functionality of the contracts using Hardhat's testing framework:

```bash
npx hardhat test
```

### Verifying Contracts

After deployment, verify your contracts on PolygonScan:

```bash
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
```

### Project Scripts

- **Compile Contracts**:

```bash
npm run compile
```

- **Test Contracts**:

```bash
npm run test
```

- **Deploy to Mumbai Testnet**:

```bash
npm run deploy:access:mumbai
```

- **Deploy to Polygon Mainnet**:

```bash
npm run deploy:access:polygon
```

- **Verify Contracts**:

```bash
npm run verify -- DEPLOYED_CONTRACT_ADDRESS
```

## Key Features

### STACToken

- **ERC20 Standard**: Fully compliant with the ERC20 specification.
- **Initial Supply**: 1,000,000 tokens minted to the deployer's address.
- **Transfer Functionality**: Supports standard transfer, approve, and transferFrom.

### STACAccessCode

- **Access Control**: Users can purchase unique access codes using native cryptocurrency (e.g., MATIC). Each code is tied to a specific user and can be reused by the same user for the duration of its validity.
- **Event Emission**: Emits `AccessCodeGenerated` and `AccessCodeRevoked` events for real-time tracking and integration with external systems.
- **Admin Features**: Contract owners can update access prices, revoke access for users, and withdraw accumulated funds.
- **Security**:
  - The actual access code is private and not stored on-chain. Only its hashed version is recorded for validation purposes.
  - Ensures that access codes are user-specific and cannot be used by others.
  - Supports time-limited validity for access codes to balance user convenience and security.

## License

This repository is licensed under the Apache 2.0 License. See the LICENSE file for details.

## Contributions

We welcome contributions! Please follow these steps:

- Fork the repository.
- Create a new branch (`feature/your-feature-name`).
- Commit your changes and open a pull request.

## Contact

Have questions or feedback? Reach out to us:

Email: jonathan.d.healy@gmail.com
GitHub: stacchain
Website: https://stacchain.github.io
