import { mountWidget, useToolOutput } from "skybridge/web";
import type { StockData } from "./types";
import { cn } from "@/utils";
import "../index.css";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart,
  DollarSign,
} from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function StockPriceWidget() {
  const stockData = useToolOutput() as StockData | null;

  if (!stockData) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const isPositive = stockData.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const ArrowIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  const formatNumber = (num: number | undefined, decimals: number = 2): string => {
    if (num === undefined) return "N/A";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatLargeNumber = (num: number | undefined): string => {
    if (num === undefined) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatVolume = (num: number | undefined): string => {
    if (num === undefined) return "N/A";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="relative w-full rounded-[40px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-[2px] shadow-2xl">
      <div className="rounded-[40px] bg-white px-8 py-10 lg:px-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Hero Price Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Price Card */}
            <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-8 shadow-lg ring-1 ring-black/5">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-6 border-b border-gray-100 pb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-5xl font-bold tracking-tight text-[#1e1e1e]">{stockData.symbol}</h1>
                      <p className="text-[#5d6e9e] text-lg font-medium mt-1">{stockData.name}</p>
                    </div>
                  </div>
                  {stockData.exchangeName && (
                    <div className="flex items-center gap-2 mt-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full w-fit">
                      <p className="text-[#5d6e9e] text-xs font-bold uppercase tracking-wider">
                        {stockData.exchangeName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-xl font-semibold text-[#5d6e9e]">{stockData.currency}</span>
                  <span className="text-6xl font-bold tracking-tight text-[#1e1e1e]">
                    {formatNumber(stockData.price)}
                  </span>
                </div>

                {/* Change Display */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className={cn(
                      "px-6 py-3 rounded-2xl text-white font-bold text-xl shadow-lg ring-1 ring-black/5 flex items-center gap-2 transition-all",
                      isPositive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-rose-500 to-pink-500",
                    )}
                  >
                    <ArrowIcon className="w-5 h-5" />
                    {isPositive ? "+" : ""}
                    {formatNumber(stockData.change)}
                  </div>
                  <div
                    className={cn(
                      "px-5 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2 text-white ring-1 ring-black/5 transition-all",
                      isPositive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-rose-500 to-pink-500",
                    )}
                  >
                    <TrendIcon className="w-5 h-5" />
                    <span className="text-xl">
                      {isPositive ? "+" : ""}
                      {stockData.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Day Range Cards - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-5">
              {/* Open Price Card */}
              <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#5d6e9e] mb-2">Open Price</div>
                <div className="text-3xl font-bold text-[#1e1e1e]">{formatNumber(stockData.open)}</div>
              </div>

              {/* Previous Close Card */}
              <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-md">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#5d6e9e] mb-2">Previous Close</div>
                <div className="text-3xl font-bold text-[#1e1e1e]">{formatNumber(stockData.previousClose)}</div>
              </div>

              {/* Day High Card */}
              <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#5d6e9e] mb-2">Day High</div>
                <div className="text-3xl font-bold text-[#1e1e1e]">{formatNumber(stockData.dayHigh)}</div>
              </div>

              {/* Day Low Card */}
              <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-md">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#5d6e9e] mb-2">Day Low</div>
                <div className="text-3xl font-bold text-[#1e1e1e]">{formatNumber(stockData.dayLow)}</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Market Data */}
          <div className="lg:col-span-1 space-y-6">
            {/* Market Stats Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#404040] to-[#525252] p-8 text-white shadow-2xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Market Stats</h2>
              </div>

              <div className="space-y-4">
                {/* Volume */}
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-white/70 font-bold uppercase tracking-wider flex items-center gap-2">
                      Volume
                    </div>
                    <Target className="w-4 h-4 text-white/60" />
                  </div>
                  <div className="text-2xl font-bold text-white">{formatVolume(stockData.volume)}</div>
                </div>

                {/* Market Cap */}
                {stockData.marketCap && (
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-white/70 font-bold uppercase tracking-wider flex items-center gap-2">
                        Market Cap
                      </div>
                      <PieChart className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatLargeNumber(stockData.marketCap)}</div>
                  </div>
                )}

                {/* 52 Week High */}
                {stockData.fiftyTwoWeekHigh && (
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-white/70 font-bold uppercase tracking-wider flex items-center gap-2">
                        52 Week High
                      </div>
                      <TrendingUp className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(stockData.fiftyTwoWeekHigh)}</div>
                  </div>
                )}

                {/* 52 Week Low */}
                {stockData.fiftyTwoWeekLow && (
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-white/70 font-bold uppercase tracking-wider flex items-center gap-2">
                        52 Week Low
                      </div>
                      <TrendingDown className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(stockData.fiftyTwoWeekLow)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

mountWidget(<StockPriceWidget />);
