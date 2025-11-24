import { mountWidget, useToolOutput } from "skybridge/web";
import type { StockComparisonData, CompareStockData } from "./types";
import { cn } from "@/utils";
import "../index.css";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function CompareStocksWidget() {
  const comparisonData = useToolOutput() as StockComparisonData | null;

  if (!comparisonData) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const formatNumber = (num: number | undefined, decimals: number = 2): string => {
    if (num === undefined || num === null) return "—";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatLargeNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return "—";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatVolume = (num: number | undefined): string => {
    if (num === undefined || num === null) return "—";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  // Color palette for stock headers
  const stockColors = [
    "from-indigo-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-rose-500 to-pink-500",
    "from-cyan-500 to-blue-500",
  ];

  const stocks = comparisonData.stocks;

  // Define metrics to display
  const metrics: {
    label: string;
    getValue: (stock: CompareStockData) => React.ReactNode;
    highlight?: boolean;
  }[] = [
    {
      label: "Price",
      getValue: (stock) => (
        <span className="text-lg font-bold text-[#1e1e1e]">
          {stock.currency} {formatNumber(stock.price)}
        </span>
      ),
      highlight: true,
    },
    {
      label: "Change",
      getValue: (stock) => {
        const isPositive = stock.change >= 0;
        return (
          <div className="flex items-center justify-center gap-2">
            <span
              className={cn(
                "font-semibold",
                isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {isPositive ? "+" : ""}
              {formatNumber(stock.change)}
            </span>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            )}
          </div>
        );
      },
    },
    {
      label: "Change %",
      getValue: (stock) => {
        const isPositive = stock.changePercent >= 0;
        return (
          <span
            className={cn(
              "px-2 py-1 rounded-lg text-sm font-semibold",
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            )}
          >
            {isPositive ? "+" : ""}
            {stock.changePercent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      label: "Market Cap",
      getValue: (stock) => formatLargeNumber(stock.marketCap),
    },
    {
      label: "P/E Ratio",
      getValue: (stock) => formatNumber(stock.peRatio),
    },
    {
      label: "EPS",
      getValue: (stock) =>
        stock.eps !== undefined ? `$${formatNumber(stock.eps)}` : "—",
    },
    {
      label: "Volume",
      getValue: (stock) => formatVolume(stock.volume),
    },
    {
      label: "Open",
      getValue: (stock) => `$${formatNumber(stock.open)}`,
    },
    {
      label: "Day High",
      getValue: (stock) => `$${formatNumber(stock.dayHigh)}`,
    },
    {
      label: "Day Low",
      getValue: (stock) => `$${formatNumber(stock.dayLow)}`,
    },
    {
      label: "52W High",
      getValue: (stock) =>
        stock.fiftyTwoWeekHigh !== undefined
          ? `$${formatNumber(stock.fiftyTwoWeekHigh)}`
          : "—",
    },
    {
      label: "52W Low",
      getValue: (stock) =>
        stock.fiftyTwoWeekLow !== undefined
          ? `$${formatNumber(stock.fiftyTwoWeekLow)}`
          : "—",
    },
    {
      label: "Div Yield",
      getValue: (stock) =>
        stock.dividendYield !== undefined
          ? `${formatNumber(stock.dividendYield)}%`
          : "—",
    },
  ];

  return (
    <div className="relative w-full rounded-[40px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-[2px] shadow-2xl">
      <div className="rounded-[40px] bg-white px-8 py-10 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1e1e1e]">
                Stock Comparison
              </h1>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse">
            {/* Header Row - Stock Symbols */}
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-6 py-4 text-left text-sm font-bold text-[#5d6e9e] uppercase tracking-wider border-b border-gray-200">
                  Metric
                </th>
                {stocks.map((stock, index) => (
                  <th
                    key={stock.symbol}
                    className="px-6 py-4 text-center border-b border-gray-200 min-w-[160px]"
                  >
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r text-white font-bold shadow-md",
                        stockColors[index % stockColors.length]
                      )}
                    >
                      <span className="text-lg">{stock.symbol}</span>
                    </div>
                    <p className="text-xs text-[#5d6e9e] mt-2 font-medium truncate max-w-[140px] mx-auto">
                      {stock.name}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body - Metrics Rows */}
            <tbody>
              {metrics.map((metric, rowIndex) => (
                <tr
                  key={metric.label}
                  className={cn(
                    "transition-colors hover:bg-gray-50",
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  )}
                >
                  <td
                    className={cn(
                      "sticky left-0 z-10 px-6 py-4 text-sm font-semibold text-[#5d6e9e] border-b border-gray-100",
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                  >
                    {metric.label}
                  </td>
                  {stocks.map((stock) => (
                    <td
                      key={`${stock.symbol}-${metric.label}`}
                      className={cn(
                        "px-6 py-4 text-center text-sm font-medium text-[#1e1e1e] border-b border-gray-100",
                        metric.highlight && "bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
                      )}
                    >
                      {metric.getValue(stock)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Performer */}
          {(() => {
            const bestPerformer = [...stocks].sort(
              (a, b) => b.changePercent - a.changePercent
            )[0];
            const isPositive = bestPerformer.changePercent >= 0;
            return (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700 uppercase tracking-wide">
                    Best Performer
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-700">
                    {bestPerformer.symbol}
                  </span>
                  <span
                    className={cn(
                      "text-lg font-semibold",
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {bestPerformer.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Largest Market Cap */}
          {(() => {
            const largestCap = [...stocks]
              .filter((s) => s.marketCap)
              .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))[0];
            if (!largestCap) return null;
            return (
              <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-700 uppercase tracking-wide">
                    Largest Market Cap
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo-700">
                    {largestCap.symbol}
                  </span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {formatLargeNumber(largestCap.marketCap)}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Worst Performer */}
          {(() => {
            const worstPerformer = [...stocks].sort(
              (a, b) => a.changePercent - b.changePercent
            )[0];
            const isPositive = worstPerformer.changePercent >= 0;
            return (
              <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-4 border border-rose-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-bold text-rose-700 uppercase tracking-wide">
                    Worst Performer
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-rose-700">
                    {worstPerformer.symbol}
                  </span>
                  <span
                    className={cn(
                      "text-lg font-semibold",
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {worstPerformer.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}

mountWidget(<CompareStocksWidget />);
