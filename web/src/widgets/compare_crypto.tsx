import { mountWidget, useToolOutput } from "skybridge/web";
import type { CryptoComparisonData, CompareCryptoData } from "./types";
import { cn } from "@/utils";
import "../index.css";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
} from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function CompareCryptoWidget() {
  const comparisonData = useToolOutput() as CryptoComparisonData | null;

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

  const formatSupply = (num: number | undefined): string => {
    if (num === undefined || num === null) return "—";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  // Color palette for crypto headers
  const cryptoColors = [
    "from-orange-500 to-amber-500",
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-red-500",
  ];

  const cryptos = comparisonData.cryptos;

  // Define metrics to display
  const metrics: {
    label: string;
    getValue: (crypto: CompareCryptoData) => React.ReactNode;
    highlight?: boolean;
  }[] = [
    {
      label: "Price",
      getValue: (crypto) => (
        <span className="text-lg font-bold text-[#1e1e1e]">
          ${formatNumber(crypto.price)}
        </span>
      ),
      highlight: true,
    },
    {
      label: "24h Change",
      getValue: (crypto) => {
        const isPositive = crypto.change >= 0;
        return (
          <div className="inline-flex items-center justify-center gap-2">
            <span
              className={cn(
                "font-semibold",
                isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {isPositive ? "+" : ""}
              ${formatNumber(Math.abs(crypto.change))}
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
      label: "24h Change %",
      getValue: (crypto) => {
        const isPositive = crypto.changePercent >= 0;
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
            {crypto.changePercent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      label: "Market Cap",
      getValue: (crypto) => formatLargeNumber(crypto.marketCap),
    },
    {
      label: "24h Volume",
      getValue: (crypto) => `$${formatVolume(crypto.volume)}`,
    },
    {
      label: "Open",
      getValue: (crypto) => `$${formatNumber(crypto.open)}`,
    },
    {
      label: "Day High",
      getValue: (crypto) => `$${formatNumber(crypto.dayHigh)}`,
    },
    {
      label: "Day Low",
      getValue: (crypto) => `$${formatNumber(crypto.dayLow)}`,
    },
    {
      label: "52W High",
      getValue: (crypto) =>
        crypto.fiftyTwoWeekHigh !== undefined
          ? `$${formatNumber(crypto.fiftyTwoWeekHigh)}`
          : "—",
    },
    {
      label: "52W Low",
      getValue: (crypto) =>
        crypto.fiftyTwoWeekLow !== undefined
          ? `$${formatNumber(crypto.fiftyTwoWeekLow)}`
          : "—",
    },
    {
      label: "Circulating Supply",
      getValue: (crypto) => formatSupply(crypto.circulatingSupply),
    },
  ];

  return (
    <div className="relative w-full rounded-[40px] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-[2px] shadow-2xl">
      <div className="rounded-[40px] bg-white px-8 py-10 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <Bitcoin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1e1e1e]">
                Crypto Comparison
              </h1>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse">
            {/* Header Row - Crypto Symbols */}
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-6 py-4 text-left text-sm font-bold text-[#5d6e9e] uppercase tracking-wider border-b border-gray-200">
                  Metric
                </th>
                {cryptos.map((crypto, index) => (
                  <th
                    key={crypto.symbol}
                    className="px-6 py-4 text-center border-b border-gray-200 min-w-[160px]"
                  >
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r text-white font-bold shadow-md",
                        cryptoColors[index % cryptoColors.length]
                      )}
                    >
                      <span className="text-lg">{crypto.symbol}</span>
                    </div>
                    <p className="text-xs text-[#5d6e9e] mt-2 font-medium truncate max-w-[140px] mx-auto">
                      {crypto.name}
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
                  {cryptos.map((crypto) => (
                    <td
                      key={`${crypto.symbol}-${metric.label}`}
                      className={cn(
                        "px-6 py-4 text-center text-sm font-medium text-[#1e1e1e] border-b border-gray-100",
                        metric.highlight && "bg-gradient-to-r from-orange-50/50 to-amber-50/50"
                      )}
                    >
                      {metric.getValue(crypto)}
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
            const bestPerformer = [...cryptos].sort(
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
            const largestCap = [...cryptos]
              .filter((c) => c.marketCap)
              .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))[0];
            if (!largestCap) return null;
            return (
              <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-bold text-orange-700 uppercase tracking-wide">
                    Largest Market Cap
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-orange-700">
                    {largestCap.symbol}
                  </span>
                  <span className="text-lg font-semibold text-orange-600">
                    {formatLargeNumber(largestCap.marketCap)}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Worst Performer */}
          {(() => {
            const worstPerformer = [...cryptos].sort(
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

mountWidget(<CompareCryptoWidget />);
