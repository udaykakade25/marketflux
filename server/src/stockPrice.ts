import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface StockData {
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
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  currency: string;
  exchangeName?: string;
  timestamp: number;
  [key: string]: unknown;
}

export async function getStockPrice(symbol: string): Promise<StockData> {
  try {
    const quote: any = await yahooFinance.quote(symbol);

    if (!quote) {
      throw new Error(`Stock symbol "${symbol}" not found`);
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
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      currency: quote.currency || "USD",
      exchangeName: quote.fullExchangeName,
      timestamp: Date.now(),
    };
  } catch (error) {
    throw new Error(`Failed to fetch stock price for ${symbol}: ${error}`);
  }
}
