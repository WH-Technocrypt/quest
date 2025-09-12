# Web Quest Platform Smart Contract Deployment Guide

## Prerequisites

1. **Remix IDE**: Go to [remix.ethereum.org](https://remix.ethereum.org)
2. **MetaMask**: Install MetaMask browser extension
3. **Test ETH**: Get some test ETH from a faucet for the network you're deploying to

## Deployment Steps

### 1. Install OpenZeppelin Contracts

In Remix, go to the File Explorer and create a new folder called `contracts`. Then:

1. Click on the "Solidity Compiler" tab
2. Go to the "File Explorer" tab
3. Create a new file: `WebQuestPlatform.sol`
4. Copy and paste the contract code from `WebQuestPlatform.sol`

### 2. Install Dependencies

In the terminal tab in Remix, run:
```bash
npm install @openzeppelin/contracts
```

Or use the Remix plugin manager to install OpenZeppelin contracts.

### 3. Compile the Contract

1. Go to the "Solidity Compiler" tab
2. Select compiler version: `0.8.19` or higher
3. Click "Compile WebQuestPlatform.sol"
4. Ensure there are no compilation errors

### 4. Deploy the Contract

1. Go to the "Deploy & Run Transactions" tab
2. Select "Environment": Choose your preferred network
   - **Remix VM**: For testing (free, no real ETH needed)
   - **Injected Provider - MetaMask**: For testnets/mainnet
3. Select "Account": Choose your MetaMask account
4. Select "Contract": Choose "WebQuestPlatform"
5. Click "Deploy"

### 5. Verify Deployment

After deployment, you'll see the contract in the "Deployed Contracts" section. You can:

1. **Test basic functions**:
   - Call `registerUser("your_username", "your_twitter")`
   - Call `createPost("Hello Web Quest!")`
   - Check your user data with `getUser(your_address)`

2. **Create sample quests** (as owner):
   ```solidity
   createQuest(
       "Social Butterfly",
       "Like and comment on 5 posts",
       100,
       5,
       "easy",
       "daily",
       86400
   )
   ```

## Network Recommendations

### For Development/Testing:
- **Sepolia Testnet**: Ethereum testnet
- **Mumbai**: Polygon testnet
- **Remix VM**: Local testing environment

### For Production:
- **Ethereum Mainnet**: High security, higher gas costs
- **Polygon**: Lower costs, fast transactions
- **Arbitrum**: Layer 2 solution with lower costs

## Contract Features

### Core Functions:
- `registerUser()`: Register new users
- `createPost()`: Create social posts
- `likePost()`: Like posts (earns XP)
- `retweetPost()`: Retweet posts (earns XP)
- `startQuest()`: Start available quests
- `updateQuestProgress()`: Update quest progress
- `claimQuestReward()`: Claim completed quest rewards

### Admin Functions (Owner only):
- `createQuest()`: Create new quests
- `deactivatePost()`: Remove inappropriate posts
- `deactivateUser()`: Suspend users
- `deactivateQuest()`: Remove quests

### View Functions:
- `getUser()`: Get user profile data
- `getPost()`: Get post details
- `getAllPosts()`: Get all post IDs
- `getUserPosts()`: Get user's posts
- `getTotalUsers()`: Get platform statistics

## Gas Optimization Tips

1. **Batch operations**: Group multiple calls together
2. **Use events**: For data that doesn't need on-chain storage
3. **Limit string lengths**: Keep usernames and content within reasonable limits
4. **Consider Layer 2**: Deploy on Polygon or Arbitrum for lower costs

## Security Considerations

1. **Input validation**: All user inputs are validated
2. **Reentrancy protection**: Uses OpenZeppelin's ReentrancyGuard
3. **Access control**: Owner-only functions for admin operations
4. **Rate limiting**: Consider adding cooldowns for post creation

## Integration with Frontend

After deployment, you'll need the:
1. **Contract Address**: Copy from Remix after deployment
2. **ABI**: Copy from the compilation artifacts
3. **Network Details**: Chain ID, RPC URL, etc.

Update your frontend configuration with these details to interact with the deployed contract.

## Example Contract Addresses (Update with your deployed addresses)

```javascript
// Add these to your frontend configuration
const CONTRACT_ADDRESSES = {
  sepolia: "0x...", // Your deployed contract address on Sepolia
  polygon: "0x...", // Your deployed contract address on Polygon
  mainnet: "0x...", // Your deployed contract address on Mainnet
};
```

## Next Steps

1. Deploy the contract using this guide
2. Test all functions in Remix
3. Update your frontend with the contract address and ABI
4. Set up backend OAuth integration for Twitter
5. Implement contract interaction in your React components