# Stacked

Stacked is a Solana mobile investment app that enables users to invest simply, securely, and on their terms. The app provides traditional and on-chain investment options with features including portfolio management, staking, validator interactions, and time-locked escrow functionality. Built with Expo, React Native, and Anchor smart contracts, Stacked offers a seamless mobile experience for managing Solana-based investments.


https://github.com/user-attachments/assets/92abaa8d-4ea9-4838-abc7-11cf14b26714


## Setup Instructions

### 1. Build Contracts

First, navigate to the contracts directory and build the Anchor program:

```bash
cd contracts
anchor build
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
REDIS_URL=redis://localhost:6379
PORT_POLLER=3001
PORT_WS_SERVER=3002
PROGRAM_ID=<your_program_id>
DEVNET_RPC_URL=https://api.devnet.solana.com
```

**Note:** For local Redis using Docker, you can run:
```bash
docker run -d -p 6379:6379 redis
```

This will start Redis on `redis://localhost:6379`.

### 3. Start Backend Services

From the root directory, start the development servers:

```bash
bun run dev
```

This will start the poller and WebSocket server services.

### 4. Set Up and Run Client App

Navigate to the client app directory and install dependencies:

```bash
cd apps/client
pnpm i
```

Create a `.env` file in `apps/client/` with the following environment variables:

```bash
EXPO_PUBLIC_WS_URL=ws://localhost:3002
EXPO_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

The WebSocket URL should match the `PORT_WS_SERVER` from the root `.env` file.

Then, run the Android app:

```bash
pnpm run android
```

## Project Structure

- `contracts/` - Anchor smart contracts
- `apps/client/` - Expo/React Native mobile client
- `apps/poller/` - Background polling service
- `apps/ws-server/` - WebSocket server for real-time updates
- `packages/` - Shared packages (config, db, types)

