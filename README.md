# MarketFlux

This is a real-time stock price application, demonstrating interactive widget rendering in ChatGPT.

## Overview

This application provides real-time stock price information using Yahoo Finance. It includes:

- **MCP Server**: Exposes a `get_stock_price` tool that fetches live stock data
- **Interactive Widget**: Displays stock information with a beautiful UI in ChatGPT
- **Real-time Data**: Current price, changes, volume, market cap, 52-week highs/lows, and more

The app uses the Model Context Protocol (MCP) to integrate seamlessly with ChatGPT, allowing users to query stock prices directly in conversation with rich visual feedback.

## Getting Started

### Prerequisites

- Node.js 22+ (see `.nvmrc` for exact version)
- pnpm (install with `npm install -g pnpm`)
- Ngrok

### Local Development with Hot Module Replacement (HMR)

This project uses Vite for React widget development with full HMR support, allowing you to see changes in real-time, directly within ChatGPT conversation, without restarting the server.

#### 1. Clone and Install

```bash
git clone <repository-url>
cd marketflux
pnpm install
```

#### 2. Start the Development Server

Run the development server from the root directory:

```bash
pnpm dev
```

This command starts an express server on port 3000. This server packages:

- an MCP endpoint on `/mcp` - aka as the ChatGPT App Backend
- a React application on Vite HMR dev server - aka as the ChatGPT App Frontend

#### 3. Expose Your Local Server

In a separate terminal, expose your local server using ngrok:

```bash
ngrok http 3000
```

Copy the forwarding URL from ngrok output:

```bash
Forwarding     https://3785c5ddc4b6.ngrok-free.app -> http://localhost:3000
```

#### 4. Connect to ChatGPT

- Toggle **Settings → Connectors → Advanced → Developer mode** in the ChatGPT client
- Navigate to **Settings → Connectors → Create**
- Enter your ngrok URL with the `/mcp` path (e.g., `https://3785c5ddc4b6.ngrok-free.app/mcp`)
- Click **Create**

#### 5. Test Your Integration

- Start a new conversation in ChatGPT
- Select your newly created connector using **+ → Plus → Your connector**
- Try prompting the model (e.g., "Show me AAPL stock price" or "Get Tesla stock information")

## Widget Naming Convention

**Important:** For a widget to work properly, the name of the endpoint in your MCP server must match the file name of the corresponding React component in `web/src/widgets/`.

For example:

- The `get_stock_price` widget endpoint corresponds to `web/src/widgets/get_stock_price.tsx`
- The endpoint name and the widget file name (without the `.tsx` extension) must be identical

This naming convention allows the system to automatically map widget requests to their corresponding React components.

## Deploy to Production

Use Alpic to deploy your OpenAI App to production.

[![Deploy on Alpic](https://assets.alpic.ai/button.svg)](https://app.alpic.ai/new/clone?repositoryUrl=https%3A%2F%2Fgithub.com%2Falpic-ai%2Fapps-sdk-template)

- In ChatGPT, navigate to **Settings → Connectors → Create** and add your MCP server URL (e.g., `https://your-app-name.alpic.live`)

## Project Structure

```
.
├── server/
│   ├── src/
│   │   ├── index.ts        # Express server entry point
│   │   ├── server.ts       # MCP server with get_stock_price widget tool
│   │   ├── stockPrice.ts   # Yahoo Finance integration for fetching stock data
│   │   ├── middleware.ts   # MCP request handler
│   │   └── env.ts          # Environment configuration
│   └── package.json        # Server dependencies (includes yahoo-finance2)
└── web/
    └── src/
        └── widgets/
            ├── get_stock_price.tsx  # Stock price widget component
            └── types.ts             # TypeScript interfaces for stock data
```

## Features

- **Real-time Stock Data**: Fetches current market data from Yahoo Finance
- **Comprehensive Metrics**:
  - Current price and daily change percentage
  - Day high/low and opening price
  - Trading volume and market capitalization
  - 52-week high/low ranges
- **Beautiful UI**: Responsive widget with color-coded changes (green for gains, red for losses)
- **Multiple Display Modes**: Adapts to inline and fullscreen views in ChatGPT

## Resources

- [Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Alpic Documentation](https://docs.alpic.ai/)
