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

## How an External API Validates an Access Code

### 1. User Interaction with the API:

- The user sends their **access code** and wallet address to the API to request data access.
- Example: The user provides `STAC-abc123` as their access code and `0xUserAddress` as their wallet address.

### 2. API Queries the Blockchain:

- The API interacts with the **STACAccessCode** contract deployed on the blockchain to validate the access code.
- The API uses the following contract function for validation:

```solidity
function verifyAccessCode(address user, string memory accessCode) external view returns (bool)
```

- The API provides the user's wallet address (user) and the access code (accessCode) to this function.

### 3. Blockchain Verification:

- The contract checks:
  - The hash of the provided `accessCode` matches the stored hash for the `user`.
  - The access code has **not expired** (if time-limited).
- The contract returns `true` if the access code is valid and `false` otherwise.

### 4. API Grants or Denies Access:

- If the contract returns `true`, the API grants access to the requested data.
- If the contract returns `false`, the API denies access and may return an error message indicating an invalid or expired access code.

## Example Workflow

### Step 1: User Sends Request

- The user sends the following to the API:

```json
{
  "accessCode": "STAC-abc123",
  "walletAddress": "0xUserAddress"
}
```

### Step 2: API Validates the Access Code

- The API uses a blockchain library (e.g., **Ethers.js** or **Web3.js**) to query the contract:

```javascript
const contract = new ethers.Contract(contractAddress, contractABI, provider);

const isValid = await contract.verifyAccessCode(
  userWalletAddress,
  userProvidedAccessCode
);

if (isValid) {
  // Grant access
  return { success: true, message: "Access granted." };
} else {
  // Deny access
  return { success: false, message: "Invalid or expired access code." };
}
```

### Step 3: Grant or Deny Access

- If the code is valid, the API allows the user to access the requested geospatial data.
- If the code is invalid or expired, the API denies access and informs the user.

## How the API Idenitfies a Valid Code

### 1. Tied to the User's Address:

- The access code is only valid for the wallet address that purchased it.
- The contract checks the combination of the user's wallet address and the provided access code.

### 2. Tamper-Proof Hash:

- The access code is hashed and stored on-chain. An attacker cannot generate a valid hash without the original access code.

### 3. Expiration Time:

- If the access code has an expiration period, the contract ensures it is still valid at the time of verification.

## Advantages of On-Chain Validation

- **Security**:
  - The blockchain provides a decentralized and tamper-proof mechanism for validating access codes.
  - Even the API operator cannot forge a valid access code.
- **Transparency**:
  - Users can verify the validity of their own access codes on-chain.
- **Flexibility**:
  - The API can validate access codes in real-time without needing to manage its own database of keys.

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
