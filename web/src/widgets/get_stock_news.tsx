import { mountWidget, useToolOutput } from "skybridge/web";
import type { StockNewsData, NewsArticle } from "./types";
import "../index.css";
import { Newspaper, ExternalLink, BookOpen } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function StockNewsWidget() {
  const newsData = useToolOutput() as StockNewsData | null;

  if (!newsData) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const NewsCard = ({ article }: { article: NewsArticle }) => {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-2xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl hover:scale-[1.02] hover:ring-indigo-500/20"
      >
        <div className="flex gap-6">
          {/* Thumbnail */}
          {article.thumbnail && (
            <div className="flex-shrink-0">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-32 h-32 object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-xl font-bold text-[#1e1e1e] tracking-tight mb-3 line-clamp-2">
              {article.title}
            </h3>

            {/* Summary */}
            {article.summary && (
              <p className="text-sm text-[#5d6e9e] mb-4 line-clamp-2">
                {article.summary}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-[#5d6e9e] font-medium">
                <BookOpen className="w-4 h-4" />
                <span className="truncate">{article.publisher}</span>
              </div>
              <div className="flex-1"></div>
              <ExternalLink className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="relative w-full rounded-[40px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-[2px] shadow-2xl">
      <div className="rounded-[40px] bg-white px-8 py-10 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
              <Newspaper className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1e1e1e]">
                Stock Market News
              </h1>
            </div>
          </div>
        </div>

        {/* News List */}
        {newsData.articles.length > 0 ? (
          <div className="space-y-4 mb-6">
            {newsData.articles.map((article, index) => (
              <NewsCard key={`${article.link}-${index}`} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-500">No news articles found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search query</p>
          </div>
        )}

      </div>
    </div>
  );
}

mountWidget(<StockNewsWidget />);
