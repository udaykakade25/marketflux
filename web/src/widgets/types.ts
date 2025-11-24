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
  circulatingSupply?: number;
  currency: string;
  exchangeName?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface NewsArticle {
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  thumbnail?: string;
  summary?: string;
}

export interface StockNewsData {
  query: string;
  articles: NewsArticle[];
  timestamp?: number;
  [key: string]: unknown;
}

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

export interface CryptoNewsData {
  query: string;
  articles: NewsArticle[];
  timestamp?: number;
  [key: string]: unknown;
}

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
