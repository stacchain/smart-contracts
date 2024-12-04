# **stacchain**

## Smart Contracts for the STAC Ecosystem

This repository contains smart contracts for the **STAC Ecosystem**, including:

- **STACToken**: An ERC20 token for the STAC ecosystem.
- **STACAccessKey**: A smart contract for purchasing access keys to geospatial data collections using blockchain technology.

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
