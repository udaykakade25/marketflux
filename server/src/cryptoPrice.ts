import YahooFinance from "yahoo-finance2";
import type { StockData } from "./stockPrice.js";

const yahooFinance = new YahooFinance();

export async function getCryptoPrice(symbol: string): Promise<StockData> {
  try {
    // Format crypto symbol: if it doesn't end with -USD, append it
    let cryptoSymbol = symbol.toUpperCase();
    if (!cryptoSymbol.includes("-")) {
      cryptoSymbol = `${cryptoSymbol}-USD`;
    }

    const quote: any = await yahooFinance.quote(cryptoSymbol);

    if (!quote) {
      throw new Error(`Cryptocurrency "${symbol}" not found`);
    }

    const price = quote.regularMarketPrice ?? 0;
    const previousClose = quote.regularMarketPreviousClose ?? 0;
    const change = price - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: cryptoSymbol,
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
      circulatingSupply: quote.circulatingSupply,
      currency: "USD",
    };
  } catch (error) {
    throw new Error(`Failed to fetch crypto price for ${symbol}: ${error}`);
  }
}
