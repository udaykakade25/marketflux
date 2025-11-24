import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface CompareStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  eps?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  dividendYield?: number;
  beta?: number;
  currency: string;
  exchangeName?: string;
}

export interface StockComparisonData {
  stocks: CompareStockData[];
  timestamp?: number;
  [key: string]: unknown;
}

async function getStockData(symbol: string): Promise<CompareStockData | null> {
  try {
    const quote: any = await yahooFinance.quote(symbol);

    if (!quote) {
      return null;
    }

    const price = quote.regularMarketPrice ?? 0;
    const previousClose = quote.regularMarketPreviousClose ?? 0;
    const change = price - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || symbol,
      price,
      change,
      changePercent,
      dayHigh: quote.regularMarketDayHigh ?? 0,
      dayLow: quote.regularMarketDayLow ?? 0,
      open: quote.regularMarketOpen ?? 0,
      previousClose,
      volume: quote.regularMarketVolume ?? 0,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      eps: quote.epsTrailingTwelveMonths,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      dividendYield: quote.dividendYield ? quote.dividendYield * 100 : undefined,
      beta: quote.beta,
      currency: quote.currency || "USD",
      exchangeName: quote.fullExchangeName,
    };
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    return null;
  }
}

export async function compareStocks(symbols: string[]): Promise<StockComparisonData> {
  try {
    // Limit to 5 stocks
    const limitedSymbols = symbols.slice(0, 5).map((s) => s.toUpperCase());

    // Fetch all stock data in parallel
    const stockPromises = limitedSymbols.map((symbol) => getStockData(symbol));
    const results = await Promise.all(stockPromises);

    // Filter out null results
    const validStocks = results.filter((stock): stock is CompareStockData => stock !== null);

    if (validStocks.length === 0) {
      throw new Error("No valid stocks found for comparison");
    }

    return {
      stocks: validStocks,
    };
  } catch (error) {
    throw new Error(`Failed to compare stocks: ${error}`);
  }
}
