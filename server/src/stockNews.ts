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

export interface StockNewsData {
  query: string;
  articles: NewsArticle[];
  timestamp?: number;
  [key: string]: unknown;
}

export async function getStockNews(
  query: string,
  limit: number = 10
): Promise<StockNewsData> {
  try {
    // Use Yahoo Finance search to get news
    const searchResults: any = await yahooFinance.search(query, {
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
    throw new Error(`Failed to fetch news for "${query}": ${error}`);
  }
}
