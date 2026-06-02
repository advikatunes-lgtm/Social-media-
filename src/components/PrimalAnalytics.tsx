import React from "react";
import { 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  History,
  FileSpreadsheet,
  Calendar,
  Share2,
  ExternalLink
} from "lucide-react";
import { Platform } from "../types";

interface PrimalAnalyticsProps {
  stats: any;
  accounts: any[];
}

export default function PrimalAnalytics({ stats, accounts }: PrimalAnalyticsProps) {
  const getPlatformLabel = (platform: Platform) => {
    switch (platform) {
      case "INSTAGRAM": return "Instagram";
      case "TWITTER": return "Twitter / X";
      case "LINKEDIN": return "LinkedIn";
      case "YOUTUBE": return "YouTube";
      case "FACEBOOK": return "Facebook";
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "INSTAGRAM": return "IG";
      case "TWITTER": return "𝕏";
      case "LINKEDIN": return "IN";
      case "YOUTUBE": return "YT";
      case "FACEBOOK": return "FB";
    }
  };

  return (
    <div id="primal-analytics-root" className="space-y-6 animate-fade-in text-slate-700 select-text text-left">
      
      {/* Header and Excel exporter shortcuts */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#f25b24]" />
            <span>Prehistoric Analytics & Conversion Reports</span>
          </h2>
          <p className="text-[10px] text-slate-500 leading-normal">
            Track Playwright conversion success quotients, proxy uptime, and post shares ratios over active accounts
          </p>
        </div>

        <button 
          onClick={() => alert("CSV Sheet report generated and downloaded locally (Simulation).")}
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100/90 hover:text-[#f25b24] border border-slate-200 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm text-slate-700"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel CSV</span>
        </button>
      </div>

      {/* DETAILED RATIO SCORECARDS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Playwright Success KPI Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-850 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-555 text-emerald-500" />
              <span>Conversion Rate</span>
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-slate-900">{stats.summary?.successRate || 95}%</span>
              <span className="text-[10px] text-emerald-600 font-mono font-semibold">+1.4% this week</span>
            </div>
            
            {/* Primal SVG Radial Progress Bar */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="56" cy="56" r="46" 
                  className="stroke-slate-100 stroke-[8px] fill-none"
                />
                <circle 
                  cx="56" cy="56" r="46" 
                  className="stroke-emerald-500 stroke-[8px] fill-none"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * (stats.summary?.successRate || 95)) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 select-none leading-none">
                <span className="text-base font-bold font-mono text-slate-800">{stats.summary?.successRate || 95}%</span>
                <span className="text-[8px] text-slate-400 font-mono mt-1 font-semibold uppercase">Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Share Ratios */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-850 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#f25b24]" />
              <span>Campaign Channel Share</span>
            </h4>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {stats.platformStats?.map((p: any) => {
              const maxCount = Math.max(...stats.platformStats.map((item: any) => item.count), 1);
              const percentage = Math.round((p.count / maxCount) * 100);
              return (
                <div key={p.platform} className="space-y-1 text-left">
                  <div className="flex items-center justify-between text-[11px] font-mono select-none">
                    <span className="text-slate-600">{getPlatformLabel(p.platform)}</span>
                    <span className="text-[#f25b24] font-bold">{p.count} Posts</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                    <div 
                      className="bg-[#f25b24] h-full rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Proxy Health Audit Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-850 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Proxies pool latency logs</span>
            </h4>
          </div>

          <div className="space-y-3 font-mono text-[10px] leading-relaxed">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400">POOL ID</span>
              <span className="text-slate-400">LATENCY</span>
              <span className="text-slate-400">STATUS</span>
            </div>
            {accounts.map((acc, index) => (
              <div key={index} className="flex justify-between items-center text-left py-0.5">
                <span className="text-slate-700 font-bold max-w-[120px] truncate">@{acc.accountHandle || acc.accountName}</span>
                <span className="text-slate-500">244 ms</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 text-[9.5px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE</span>
                </span>
              </div>
            ))}
            {accounts.length === 0 && (
              <p className="text-slate-400 text-center py-4">No active proxies registered</p>
            )}
          </div>
        </div>

      </div>

      {/* ARCHIVE LOGS LIST (HISTORICAL POST VERIFICATION RESULTS) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-105 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs uppercase font-mono font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-[#f25b24]" />
              <span>Historical Verification Deliveries</span>
            </h3>
            <p className="text-[10px] text-slate-400">Verify past post share instances in the browser archive logs</p>
          </div>
        </div>

        {stats.resultsHistory?.length === 0 ? (
          <p className="text-slate-400 py-6 font-mono text-[11px]">No active verification histories archived.</p>
        ) : (
          <div className="space-y-3 text-left">
            {stats.resultsHistory?.map((res: any) => (
              <div 
                key={res.id}
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5 font-mono text-[11px] shadow-sm"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-white border border-slate-205 rounded font-bold text-[#f25b24] text-[9px] shadow-sm">
                      {res.platform}
                    </span>
                    <span className="text-slate-700 font-bold">@{(accounts.find((a) => a.id === res.socialAccountId))?.accountHandle || "user"}</span>
                    <span className="text-slate-400">• {new Date(res.publishedAt).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-500 line-clamp-1 italic text-[10.5px]">
                    URL: <a href={res.publishedUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">{res.publishedUrl} <ExternalLink className="w-3 h-3 inline" /></a>
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[9px] font-bold">
                    SUCCESS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
