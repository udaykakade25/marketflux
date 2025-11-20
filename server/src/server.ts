import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { McpServer } from "skybridge/server";
import { getStockPrice } from "./stockPrice.js";

const server = new McpServer(
  {
    name: "alpic-stock-price-app",
    version: "0.0.1",
  },
  { capabilities: {} },
);

server.widget(
  "get_stock_price",
  {
    description: "Real-time stock price information",
  },
  {
    description:
      "Use this tool to get real-time stock price information for any stock symbol. Provides current price, changes, volume, market cap, and more.",
    inputSchema: {
      symbol: z
        .string()
        .describe("Stock ticker symbol (e.g., AAPL, GOOGL, TSLA, MSFT)"),
    },
  },
  async ({ symbol }): Promise<CallToolResult> => {
    try {
      const stockData = await getStockPrice(symbol.toUpperCase());

      const changeDirection = stockData.change >= 0 ? "up" : "down";
      const changeSymbol = stockData.change >= 0 ? "+" : "";

      return {
        /**
         * Arbitrary JSON passed only to the component.
         * Use it for data that should not influence the model's reasoning.
         * _meta is never shown to the model.
         */
        _meta: {
          symbol: stockData.symbol,
          timestamp: stockData.timestamp,
        },
        /**
         * Structured data that is used to hydrate your component.
         * ChatGPT injects this object into your iframe as window.openai.toolOutput
         */
        structuredContent: stockData,
        /**
         * Optional free-form text that the model receives verbatim
         */
        content: [
          {
            type: "text",
            text: `${stockData.name} (${stockData.symbol}) is currently trading at ${stockData.currency} ${stockData.price.toFixed(2)}, ${changeDirection} ${changeSymbol}${stockData.change.toFixed(2)} (${changeSymbol}${stockData.changePercent.toFixed(2)}%) today.`,
          },
          {
            type: "text",
            text: `Widget shown with detailed stock information including price chart and key metrics.`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
);

export default server;
