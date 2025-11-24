import { mountWidget, useToolOutput } from "skybridge/web";
import type { MarketIndicesData, MarketIndex } from "./types";
import { cn } from "@/utils";
import "../index.css";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function MarketIndicesWidget() {
  const indicesData = useToolOutput() as MarketIndicesData | null;

  if (!indicesData) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const formatNumber = (num: number | undefined, decimals: number = 2): string => {
    if (num === undefined) return "N/A";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const IndexCard = ({ index }: { index: MarketIndex }) => {
    const isPositive = index.change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className="w-full rounded-2xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg ring-1 ring-black/5">
        <div className="flex flex-col gap-4">
          {/* Header: Name & Icon */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#1e1e1e] tracking-tight">{index.name}</h3>
              <p className="text-sm text-[#5d6e9e] font-medium mt-1">{index.symbol}</p>
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl shadow-md",
                isPositive
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                  : "bg-gradient-to-br from-rose-500 to-pink-500"
              )}
            >
              <TrendIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold tracking-tight text-[#1e1e1e]">
            {formatNumber(index.price)}
          </div>

          {/* Change Info */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "px-4 py-2 rounded-xl text-white font-bold text-base shadow-md ring-1 ring-black/5",
                isPositive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : "bg-gradient-to-r from-rose-500 to-pink-500"
              )}
            >
              {isPositive ? "+" : ""}
              {formatNumber(index.change)}
            </div>
            <div
              className={cn(
                "px-4 py-2 rounded-xl shadow-md font-bold text-white ring-1 ring-black/5",
                isPositive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : "bg-gradient-to-r from-rose-500 to-pink-500"
              )}
            >
              <span className="text-base">
                {isPositive ? "+" : ""}
                {index.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              <h1 className="text-4xl font-bold tracking-tight text-[#1e1e1e]">Market Indices</h1>
              <p className="text-[#5d6e9e] text-base font-medium mt-1">
                {indicesData.indices.length} Major Indices
              </p>
            </div>
          </div>
        </div>

        {/* Indices Grid - 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {indicesData.indices.map((index) => (
            <IndexCard key={index.symbol} index={index} />
          ))}
        </div>

      </div>
    </div>
  );
}

mountWidget(<MarketIndicesWidget />);
