import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { McpServer } from "skybridge/server";
import { getStockPrice } from "./stockPrice.js";
import { getStockNews } from "./stockNews.js";
import { getMarketIndices } from "./marketIndices.js";
import { getCryptoPrice } from "./cryptoPrice.js";
import { getCryptoNews } from "./cryptoNews.js";
import { compareStocks } from "./compareStocks.js";
import { compareCrypto } from "./compareCrypto.js";

const server = new McpServer(
  {
    name: "marketflux",
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
      symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, GOOGL, TSLA, MSFT)"),
    },
    annotations: { readOnly: true },
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

server.widget(
  "get_stock_news",
  {
    description: "Latest stock market news",
  },
  {
    description:
      "Use this tool to get the latest stock market news articles. Returns news headlines, publishers, links, and publish times for general stock market updates.",
    inputSchema: {
      limit: z.number().min(1).max(10).default(5).describe("Number of news articles to return (1-10, default: 5)"),
    },
    annotations: { readOnly: true },
  },
  async ({ limit }): Promise<CallToolResult> => {
    try {
      const newsData = await getStockNews("stock market", limit);

      const articlesCount = newsData.articles.length;
      const topHeadlines = newsData.articles
        .slice(0, 3)
        .map((article) => `"${article.title}" - ${article.publisher}`)
        .join("; ");

      return {
        _meta: {},
        structuredContent: newsData,
        content: [
          {
            type: "text",
            text: `Found ${articlesCount} stock market news articles. ${topHeadlines ? `Top headlines: ${topHeadlines}` : ""}`,
          },
          {
            type: "text",
            text: `Widget shown with ${articlesCount} news articles including headlines, publishers, and links.`,
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

server.widget(
  "get_market_indices",
  {
    description: "Major market indices performance",  
  },
  {
    description:
      "Use this tool to get current performance data for major market indices including S&P 500, NASDAQ, DOW Jones, and Russell 2000. Shows current values and daily changes.",
    inputSchema: {},
    annotations: { readOnly: true },
  },
  async (): Promise<CallToolResult> => {
    try {
      const indicesData = await getMarketIndices();

      const indicesSummary = indicesData.indices
        .map((index) => {
          const changeSymbol = index.change >= 0 ? "+" : "";
          return `${index.name}: ${index.price.toFixed(2)} (${changeSymbol}${index.changePercent.toFixed(2)}%)`;
        })
        .join(", ");

      return {
        _meta: {},
        structuredContent: indicesData,
        content: [
          {
            type: "text",
            text: `Market indices: ${indicesSummary}`,
          },
          {
            type: "text",
            text: `Widget shown with ${indicesData.indices.length} major market indices.`,
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

server.widget(
  "get_crypto_price",
  {
    description: "Real-time cryptocurrency price",    
  },
  {
    description:
      "Use this tool to get real-time cryptocurrency price information. Supports major cryptocurrencies like BTC, ETH, DOGE, SOL, ADA, XRP, etc. Prices displayed in USD.",
    inputSchema: {
      symbol: z
        .string()
        .describe("Cryptocurrency symbol (e.g., BTC, ETH, DOGE, SOL, ADA, XRP, MATIC)"),
    },
    annotations: { readOnly: true },
  },
  async ({ symbol }): Promise<CallToolResult> => {
    try {
      const cryptoData = await getCryptoPrice(symbol);

      const changeDirection = cryptoData.change >= 0 ? "up" : "down";
      const changeSymbol = cryptoData.change >= 0 ? "+" : "";

      return {
        _meta: {
          symbol: cryptoData.symbol,
        },
        structuredContent: cryptoData,
        content: [
          {
            type: "text",
            text: `${cryptoData.name} (${cryptoData.symbol}) is currently trading at ${cryptoData.currency} ${cryptoData.price.toFixed(2)}, ${changeDirection} ${changeSymbol}${cryptoData.change.toFixed(2)} (${changeSymbol}${cryptoData.changePercent.toFixed(2)}%) in the last 24 hours.`,
          },
          {
            type: "text",
            text: `Widget shown with detailed cryptocurrency information including price and key metrics.`,
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

server.widget(
  "get_crypto_news",
  {
    description: "Latest cryptocurrency news",
  },
  {
    description:
      "Use this tool to get the latest cryptocurrency market news articles. Returns news headlines, publishers, links, and publish times for general crypto market updates.",
    inputSchema: {
      limit: z
        .number()
        .min(1)
        .max(10)
        .default(5)
        .describe("Number of news articles to return (1-10, default: 5)"),
    },
    annotations: { readOnly: true },
  },
  async ({ limit }): Promise<CallToolResult> => {
    try {
      const newsData = await getCryptoNews("crypto market", limit);

      const articlesCount = newsData.articles.length;
      const topHeadlines = newsData.articles
        .slice(0, 3)
        .map((article) => `"${article.title}" - ${article.publisher}`)
        .join("; ");

      return {
        _meta: {},
        structuredContent: newsData,
        content: [
          {
            type: "text",
            text: `Found ${articlesCount} cryptocurrency news articles. ${topHeadlines ? `Top headlines: ${topHeadlines}` : ""}`,
          },
          {
            type: "text",
            text: `Widget shown with ${articlesCount} news articles including headlines, publishers, and links.`,
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

server.widget(
  "compare_stocks",
  {
    description: "Side-by-side stock comparison",
  },
  {
    description:
      "Use this tool to compare 2-5 stocks side by side. Shows key metrics including price, change, market cap, P/E ratio, EPS, 52-week high/low, dividend yield, and beta for each stock. Perfect for comparing investment options.",
    inputSchema: {
      symbols: z
        .array(z.string())
        .min(2)
        .max(5)
        .describe("Array of 2-5 stock ticker symbols to compare (e.g., ['AAPL', 'MSFT', 'GOOGL'])"),
    },
    annotations: { readOnly: true },
  },
  async ({ symbols }): Promise<CallToolResult> => {
    try {
      const comparisonData = await compareStocks(symbols);

      const stockCount = comparisonData.stocks.length;
      const stockSummary = comparisonData.stocks
        .map((stock) => {
          const changeSymbol = stock.change >= 0 ? "+" : "";
          return `${stock.symbol}: $${stock.price.toFixed(2)} (${changeSymbol}${stock.changePercent.toFixed(2)}%)`;
        })
        .join(", ");

      return {
        _meta: {
          symbols: comparisonData.stocks.map((s) => s.symbol),
        },
        structuredContent: comparisonData,
        content: [
          {
            type: "text",
            text: `Comparing ${stockCount} stocks: ${stockSummary}`,
          },
          {
            type: "text",
            text: `Widget shown with side-by-side comparison of ${stockCount} stocks including price, market cap, P/E ratio, and other key metrics.`,
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

server.widget(
  "compare_crypto",
  {
    description: "Side-by-side cryptocurrency comparison",
  },
  {
    description:
      "Use this tool to compare 2-5 cryptocurrencies side by side. Shows key metrics including price, 24h change, market cap, volume, 52-week high/low, and circulating supply for each cryptocurrency. Perfect for comparing crypto investment options.",
    inputSchema: {
      symbols: z
        .array(z.string())
        .min(2)
        .max(5)
        .describe("Array of 2-5 cryptocurrency symbols to compare (e.g., ['BTC', 'ETH', 'SOL'])"),
    },
    annotations: { readOnly: true },
  },
  async ({ symbols }): Promise<CallToolResult> => {
    try {
      const comparisonData = await compareCrypto(symbols);

      const cryptoCount = comparisonData.cryptos.length;
      const cryptoSummary = comparisonData.cryptos
        .map((crypto) => {
          const changeSymbol = crypto.change >= 0 ? "+" : "";
          return `${crypto.symbol}: $${crypto.price.toFixed(2)} (${changeSymbol}${crypto.changePercent.toFixed(2)}%)`;
        })
        .join(", ");

      return {
        _meta: {
          symbols: comparisonData.cryptos.map((c) => c.symbol),
        },
        structuredContent: comparisonData,
        content: [
          {
            type: "text",
            text: `Comparing ${cryptoCount} cryptocurrencies: ${cryptoSummary}`,
          },
          {
            type: "text",
            text: `Widget shown with side-by-side comparison of ${cryptoCount} cryptocurrencies including price, market cap, volume, and other key metrics.`,
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
