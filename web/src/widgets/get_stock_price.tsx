import { mountWidget, useOpenAiGlobal, useToolOutput } from "skybridge/web";
import type { StockData } from "./types";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUpIcon,
  Zap,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  PieChart,
} from "lucide-react";

function StockPriceWidget() {
  const stockData = useToolOutput() as StockData | null;
  const displayMode = useOpenAiGlobal("displayMode");

  if (!stockData) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl">
        <div className="text-white text-lg font-semibold animate-pulse">Loading stock data...</div>
      </div>
    );
  }

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const changeBgColor = isPositive
    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
    : "bg-gradient-to-r from-rose-500 to-pink-500";
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

  const isInline = displayMode === "inline";

  return (
    <div className={`w-full ${isInline ? "max-w-2xl" : "max-w-6xl"} mx-auto p-6`}>
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(236, 72, 153, 0.3), 0 20px 40px rgba(0,0,0,0.2);
          }
          50% { 
            box-shadow: 0 0 50px rgba(147, 51, 234, 0.6), 0 0 100px rgba(236, 72, 153, 0.5), 0 30px 60px rgba(0,0,0,0.3);
          }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slide-in {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }

        .card-hover {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .card-hover::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.05);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
        }

        .card-hover:hover::before {
          opacity: 1;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .glass-dark {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric-card {
          position: relative;
          overflow: hidden;
        }

        .metric-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
          transition: left 0.6s;
        }

        .metric-card:hover::after {
          left: 100%;
        }

        .rotate-slow {
          animation: rotate 25s linear infinite;
        }

        .slide-in {
          animation: slide-in 0.6s ease-out;
        }

        .bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .text-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .neon-border {
          position: relative;
        }

        .neon-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotate 4s linear infinite;
        }
      `}</style>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Hero Price Display */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Price Card */}
          <div
            className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 gradient-animate rounded-3xl shadow-2xl p-8 text-white overflow-hidden"
            style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -mr-48 -mt-48 rotate-slow"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300 opacity-15 rounded-full blur-3xl -ml-36 -mb-36 bounce-subtle"></div>
            <div
              className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-400 opacity-10 rounded-full blur-3xl -ml-40 -mt-40"
              style={{ animation: "float 8s ease-in-out infinite" }}
            ></div>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer pointer-events-none"></div>

            <div className="relative z-10">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="glass p-4 rounded-2xl shadow-2xl"
                      style={{ animation: "scale-pulse 3s ease-in-out infinite" }}
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-6xl font-black tracking-tight drop-shadow-lg text-glow slide-in">
                        {stockData.symbol}
                      </h1>
                      <p className="text-white/90 text-xl font-bold mt-1">{stockData.name}</p>
                    </div>
                  </div>
                  {stockData.exchangeName && (
                    <div className="flex items-center gap-2 mt-3 glass px-4 py-2 rounded-full w-fit shadow-lg">
                      <Globe className="w-4 h-4 text-white/90" />
                      <p className="text-white/90 text-sm font-black uppercase tracking-widest">
                        {stockData.exchangeName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Massive Price Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold opacity-90">{stockData.currency}</span>
                  <span className="text-8xl font-black tracking-tight drop-shadow-2xl text-glow">
                    {formatNumber(stockData.price)}
                  </span>
                </div>

                {/* Change Display */}
                <div className="flex items-center gap-4">
                  <div
                    className={`${changeBgColor} px-8 py-4 rounded-2xl text-white font-black text-3xl shadow-2xl border-3 border-white/40 flex items-center gap-3 card-hover`}
                  >
                    <ArrowIcon className="w-8 h-8" />
                    {isPositive ? "+" : ""}
                    {formatNumber(stockData.change)}
                  </div>
                  <div
                    className={`${changeBgColor} px-6 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-2 text-white border-3 border-white/40 card-hover`}
                  >
                    <TrendIcon className="w-7 h-7" />
                    <span className="text-3xl">
                      {isPositive ? "+" : ""}
                      {stockData.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-sm text-white/80 font-bold glass-dark px-5 py-3 rounded-full w-fit shadow-lg">
                <Zap className="w-4 h-4 animate-pulse" />
                Updated: {new Date(stockData.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Day Range Cards - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* Open Price Card */}
            <div className="card-hover metric-card bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300 opacity-15 rounded-full blur-2xl -ml-20 -mb-20 rotate-slow"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass p-3 rounded-xl backdrop-blur-sm shadow-lg">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm font-black uppercase tracking-wider opacity-90 mb-2">Open Price</div>
                <div className="text-5xl font-black drop-shadow-lg text-glow">{formatNumber(stockData.open)}</div>
              </div>
            </div>

            {/* Previous Close Card */}
            <div className="card-hover metric-card bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300 opacity-15 rounded-full blur-2xl -ml-20 -mb-20 rotate-slow"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass p-3 rounded-xl backdrop-blur-sm shadow-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm font-black uppercase tracking-wider opacity-90 mb-2">Previous Close</div>
                <div className="text-5xl font-black drop-shadow-lg text-glow">
                  {formatNumber(stockData.previousClose)}
                </div>
              </div>
            </div>

            {/* Day High Card */}
            <div className="card-hover metric-card bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-lime-300 opacity-15 rounded-full blur-2xl -ml-20 -mb-20 rotate-slow"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass p-3 rounded-xl backdrop-blur-sm shadow-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm font-black uppercase tracking-wider opacity-90 mb-2">Day High</div>
                <div className="text-5xl font-black drop-shadow-lg text-glow">{formatNumber(stockData.dayHigh)}</div>
              </div>
            </div>

            {/* Day Low Card */}
            <div className="card-hover metric-card bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-300 opacity-15 rounded-full blur-2xl -ml-20 -mb-20 rotate-slow"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass p-3 rounded-xl backdrop-blur-sm shadow-lg">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm font-black uppercase tracking-wider opacity-90 mb-2">Day Low</div>
                <div className="text-5xl font-black drop-shadow-lg text-glow">{formatNumber(stockData.dayLow)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Market Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* Market Stats Card */}
          <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-3xl shadow-2xl p-6 border-2 border-slate-700/50 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-3 rounded-xl shadow-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white">Market Stats</h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Volume */}
                <div className="card-hover bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border-2 border-blue-400/40 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 shimmer"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-blue-300 font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                        Volume
                      </div>
                      <Target className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-3xl font-black text-white drop-shadow-lg">
                      {formatVolume(stockData.volume)}
                    </div>
                  </div>
                </div>

                {/* Market Cap */}
                {stockData.marketCap && (
                  <div className="card-hover bg-gradient-to-br from-purple-500/15 to-pink-500/15 border-2 border-purple-400/40 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/10 to-purple-500/0 shimmer"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-purple-300 font-black uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                          Market Cap
                        </div>
                        <PieChart className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-3xl font-black text-white drop-shadow-lg">
                        {formatLargeNumber(stockData.marketCap)}
                      </div>
                    </div>
                  </div>
                )}

                {/* 52 Week High */}
                {stockData.fiftyTwoWeekHigh && (
                  <div className="card-hover bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border-2 border-emerald-400/40 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/10 to-emerald-500/0 shimmer"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-emerald-300 font-black uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                          52 Week High
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-3xl font-black text-white drop-shadow-lg">
                        {formatNumber(stockData.fiftyTwoWeekHigh)}
                      </div>
                    </div>
                  </div>
                )}

                {/* 52 Week Low */}
                {stockData.fiftyTwoWeekLow && (
                  <div className="card-hover bg-gradient-to-br from-rose-500/15 to-orange-500/15 border-2 border-rose-400/40 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-400/10 to-rose-500/0 shimmer"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-rose-300 font-black uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 bg-rose-400 rounded-full shadow-lg shadow-rose-400/50"></div>
                          52 Week Low
                        </div>
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="text-3xl font-black text-white drop-shadow-lg">
                        {formatNumber(stockData.fiftyTwoWeekLow)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time indicator - Bottom Banner */}
      <div className="mt-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full blur-xl"></div>
        <div className="relative flex items-center justify-center gap-4 glass border-2 border-green-400/50 rounded-full px-10 py-5 shadow-2xl">
          <div className="relative">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/70"></div>
            <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <span className="text-base font-black text-green-300 uppercase tracking-widest">● LIVE DATA</span>
          <div className="w-px h-6 bg-green-400/30"></div>
          <span className="text-base text-green-200 font-bold">Powered by Yahoo Finance</span>
          <Sparkles className="w-5 h-5 text-green-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

mountWidget(<StockPriceWidget />);
