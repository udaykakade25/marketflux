import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface MarketIndex {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketIndicesData {
  indices: MarketIndex[];
  timestamp?: number;
  [key: string]: unknown;
}

const MAJOR_INDICES = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^IXIC", name: "NASDAQ" },
  { symbol: "^DJI", name: "DOW Jones" },
  { symbol: "^RUT", name: "Russell 2000" },
];

export async function getMarketIndices(): Promise<MarketIndicesData> {
  try {
    const indexPromises = MAJOR_INDICES.map(async (index) => {
      try {
        const quote: any = await yahooFinance.quote(index.symbol);

        const price = quote.regularMarketPrice ?? 0;
        const previousClose = quote.regularMarketPreviousClose ?? 0;
        const change = price - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

        return {
          name: index.name,
          symbol: index.symbol,
          price,
          change,
          changePercent,
        };
      } catch (error) {
        console.error(`Failed to fetch ${index.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(indexPromises);
    const indices = results.filter((index): index is MarketIndex => index !== null);

    return {
      indices,
    };
  } catch (error) {
    throw new Error(`Failed to fetch market indices: ${error}`);
  }
}
