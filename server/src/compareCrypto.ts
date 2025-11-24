import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface CompareCryptoData {
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
  circulatingSupply?: number;
  currency: string;
}

export interface CryptoComparisonData {
  cryptos: CompareCryptoData[];
  timestamp?: number;
  [key: string]: unknown;
}

async function getCryptoData(symbol: string): Promise<CompareCryptoData | null> {
  try {
    // Format crypto symbol: if it doesn't end with -USD, append it
    let cryptoSymbol = symbol.toUpperCase();
    if (!cryptoSymbol.includes("-")) {
      cryptoSymbol = `${cryptoSymbol}-USD`;
    }

    const quote: any = await yahooFinance.quote(cryptoSymbol);

    if (!quote) {
      return null;
    }

    const price = quote.regularMarketPrice ?? 0;
    const previousClose = quote.regularMarketPreviousClose ?? 0;
    const change = price - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: cryptoSymbol.replace("-USD", ""),
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
    console.error(`Failed to fetch ${symbol}:`, error);
    return null;
  }
}

export async function compareCrypto(symbols: string[]): Promise<CryptoComparisonData> {
  try {
    // Limit to 5 cryptos
    const limitedSymbols = symbols.slice(0, 5).map((s) => s.toUpperCase());

    // Fetch all crypto data in parallel
    const cryptoPromises = limitedSymbols.map((symbol) => getCryptoData(symbol));
    const results = await Promise.all(cryptoPromises);

    // Filter out null results
    const validCryptos = results.filter((crypto): crypto is CompareCryptoData => crypto !== null);

    if (validCryptos.length === 0) {
      throw new Error("No valid cryptocurrencies found for comparison");
    }

    return {
      cryptos: validCryptos,
    };
  } catch (error) {
    throw new Error(`Failed to compare cryptocurrencies: ${error}`);
  }
}
