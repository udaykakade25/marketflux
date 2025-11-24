import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface NewsArticle {
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  thumbnail?: string;
  summary?: string;
}

export interface CryptoNewsData {
  query: string;
  articles: NewsArticle[];
  timestamp?: number;
  [key: string]: unknown;
}

export async function getCryptoNews(
  query: string,
  limit: number = 5
): Promise<CryptoNewsData> {
  try {
    // Format query for crypto: if it's a single word without "-", assume it's a crypto symbol
    let searchQuery = query;
    if (query.split(" ").length === 1 && !query.includes("-")) {
      // Single crypto symbol like BTC, ETH - append "-USD" for better results
      searchQuery = `${query.toUpperCase()}-USD cryptocurrency`;
    } else if (query.toLowerCase().includes("crypto")) {
      // Already mentions crypto, use as is
      searchQuery = query;
    } else {
      // General query, add "cryptocurrency" for better context
      searchQuery = `${query} cryptocurrency`;
    }

    // Use Yahoo Finance search to get news
    const searchResults: any = await yahooFinance.search(searchQuery, {
      newsCount: limit,
    });

    if (!searchResults || !searchResults.news) {
      return {
        query,
        articles: [],
        timestamp: Date.now(),
      };
    }

    // Map news results to our interface
    const articles: NewsArticle[] = searchResults.news.map((article: any) => ({
      title: article.title || "No title",
      publisher: article.publisher || "Unknown",
      link: article.link || "",
      publishedAt: article.providerPublishTime
        ? article.providerPublishTime * 1000
        : Date.now(),
      thumbnail: article.thumbnail?.resolutions?.[0]?.url,
      summary: article.summary,
    }));

    return {
      query,
      articles,
    };
  } catch (error) {
    throw new Error(`Failed to fetch crypto news for "${query}": ${error}`);
  }
}
