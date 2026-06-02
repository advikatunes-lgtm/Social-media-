import React from "react";
import { 
  Sparkles, 
  Calendar, 
  Layers, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Tv
} from "lucide-react";
import { Post, SocialAccount, Platform } from "../types";

interface PrimalDashboardProps {
  summary: {
    totalPosts: number;
    published: number;
    scheduled: number;
    failed: number;
    connectedAccounts: number;
    successRate: number;
  };
  posts: Post[];
  accounts: SocialAccount[];
  auditLogs: any[];
  onTriggerTab: (tabName: string) => void;
  onRunPostNow: (postId: string) => void;
}

export default function PrimalDashboard({
  summary,
  posts,
  accounts,
  auditLogs,
  onTriggerTab,
  onRunPostNow
}: PrimalDashboardProps) {
  
  // Format upcoming posts within 24 hours
  const upcomingPosts = posts
    .filter((p) => p.status === "SCHEDULED" && p.scheduledAt)
    .sort((a,b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 3);

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "INSTAGRAM":
        return <span className="font-extrabold text-[10px] bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 bg-clip-text text-transparent">IG</span>;
      case "TWITTER":
        return <span className="font-bold text-[10px] text-slate-800">X</span>;
      case "LINKEDIN":
        return <span className="font-extrabold text-[10px] text-blue-600">IN</span>;
      case "YOUTUBE":
        return <span className="font-extrabold text-[10px] text-red-650">YT</span>;
      case "FACEBOOK":
        return <span className="font-extrabold text-[10px] text-[#1877f2]">FB</span>;
    }
  };

  const getPlatformColor = (platform: Platform) => {
    switch (platform) {
      case "INSTAGRAM": return "bg-pink-50 border-pink-200 text-pink-600";
      case "TWITTER": return "bg-slate-100 border-slate-200 text-slate-800";
      case "LINKEDIN": return "bg-blue-50 border-blue-200 text-blue-700";
      case "YOUTUBE": return "bg-red-50 border-red-200 text-red-600";
      case "FACEBOOK": return "bg-sky-50 border-sky-100 text-sky-700";
    }
  };

  return (
    <div id="primal-dashboard-root" className="space-y-6 animate-fade-in text-slate-600">
      
      {/* Dynamic welcome header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#f25b24]"></div>
        <div className="space-y-1 pl-2">
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            Welcome Back, Chief Chief <span className="text-[#f25b24]">Thrag</span> 🔥
          </h2>
          <p className="text-xs text-slate-500">
            Primal Social Scheduler is ONLINE • Running 4 isolated proxy server pools under stealth profile automation.
          </p>
        </div>
        
        <button
          onClick={() => onTriggerTab("compose")}
          className="px-5 py-2.5 bg-[#f25b24] hover:bg-[#d64a18] text-white font-bold rounded-xl text-xs flex items-center gap-2 select-none cursor-pointer shadow-sm hover:shadow transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ignite New Content</span>
        </button>
      </div>

      {/* CORE STATS MATRIX GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Total Posts</span>
            <FileText className="w-4 h-4 text-[#f25b24]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-display text-slate-900">{summary.totalPosts}</div>
            <p className="text-[9px] text-slate-400">Scheduled, drafts & published</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-505" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-display text-emerald-600">{summary.published}</div>
            <p className="text-[9px] text-emerald-600 font-medium">Successfully pushed live</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Scheduled</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-display text-blue-600">{summary.scheduled}</div>
            <p className="text-[9px] text-blue-500 font-medium">Delayed queue buffers</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Failed Post Out</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-display text-rose-600">{summary.failed}</div>
            <p className="text-[9px] text-rose-500 font-medium font-mono">Captchas or locks</p>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.01)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center -mr-4 -mt-4 opacity-50"></div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] text-[#f25b24] font-mono uppercase tracking-wider font-semibold">Success Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-bold font-display text-emerald-600">{summary.successRate}%</div>
            <p className="text-[9px] text-slate-500">Target platform hit rate</p>
          </div>
        </div>

      </div>

      {/* THREE-COLUMN COMPOSITE SUBGRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Lg:col-span-8): SCHEDULED QUEUE WATCH + AUDITS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming scheduled posts inside 24hrs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#f25b24]" />
                  <span>Upcoming scheduled queues</span>
                </h3>
                <p className="text-[10px] text-slate-500">Next active BullMQ delayed tasks</p>
              </div>
              <button 
                onClick={() => onTriggerTab("calendar")}
                className="text-xs text-[#f25b24] hover:text-orange-500 font-mono font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Table</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                <CloudRain className="w-8 h-8 text-slate-300" />
                <p>No posts scheduled for the next 24 hours.</p>
                <button
                  onClick={() => onTriggerTab("compose")}
                  className="mt-1 font-semibold text-[#f25b24] hover:underline cursor-pointer"
                >
                  Write custom thread now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-150 rounded-xl hover:border-slate-300 transition-all group"
                  >
                    <div className="space-y-1.5 flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        {post.platforms.map((plat) => (
                          <span 
                            key={plat}
                            className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold flex items-center gap-1 border ${getPlatformColor(plat)}`}
                          >
                            {getPlatformIcon(plat)}
                            <span>{plat}</span>
                          </span>
                        ))}
                        <span className="text-[10px] text-slate-400 font-mono">
                          Scheduled: {new Date(post.scheduledAt!).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-905 group-hover:text-[#f25b24] transition-colors line-clamp-1">{post.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{post.caption}"</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button 
                        onClick={() => onRunPostNow(post.id)}
                        className="px-3 py-1.5 bg-[#f25b24]/5 hover:bg-[#f25b24] text-[#f25b24] hover:text-white border border-[#f25b24]/20 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer select-none"
                      >
                        Publish Now (Sim)
                      </button>
                      <button 
                        onClick={() => onTriggerTab("calendar")}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 border border-slate-205 rounded-lg text-xs cursor-pointer"
                        title="View details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Logs / Activity tracks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="space-y-0.5 border-b border-slate-100 pb-3 text-left">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#f25b24]" />
                <span>Primal System Audit Log</span>
              </h3>
              <p className="text-[10px] text-slate-400">Security monitoring logs of past platform actions & login checkpoints</p>
            </div>

            <div className="space-y-3 font-mono text-[10.5px]">
              {auditLogs.slice(0, 4).map((log, index) => (
                <div key={index} className="flex gap-3 text-slate-600 border-l border-slate-250 pl-3 text-left">
                  <span className="text-slate-400 text-[9px] shrink-0 mt-0.5">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  <div className="flex-1">
                    <span className="text-[#f25b24] font-semibold">{log.action}</span>
                    <span className="text-slate-450"> on </span>
                    <span className="text-slate-900 border-b border-slate-100 font-medium">{log.resource} ({log.resourceId})</span>
                    <p className="text-slate-404 text-[9px] mt-0.5">Egress IP: {log.ipAddress || "185.122.40.11"} • {log.userAgent || "Playwright Agent 1.2"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Lg:col-span-4): PLATFORM HEALTH CHECK GRID */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="space-y-0.5 border-b border-slate-100 pb-3 text-left">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#f25b24]" />
                <span>Stealth social channels</span>
              </h3>
              <p className="text-[10px] text-slate-400">Active verification metrics</p>
            </div>

            <div className="space-y-3">
              {accounts.map((acc) => (
                <div 
                  key={acc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl hover:border-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={acc.accountAvatar} 
                        alt={acc.accountName} 
                        className="w-10 h-10 rounded-xl object-cover bg-slate-200 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-[7px] font-mono uppercase flex items-center justify-center font-bold h-4 w-4 border-2 border-white ${getPlatformColor(acc.platform)}`}>
                        {getPlatformIcon(acc.platform)}
                      </span>
                    </div>
                    
                    <div className="space-y-0.5 text-left">
                      <h4 className="text-[11px] font-bold text-slate-900 leading-tight">{acc.accountName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">@{acc.accountHandle}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    {acc.sessionValid ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[8px] font-mono leading-none">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>HEALTHY</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[8px] font-mono leading-none">
                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
                        <span>EXPIRED</span>
                      </span>
                    )}
                    <span 
                      onClick={() => onTriggerTab("accounts")}
                      className="block text-[8px] text-[#f25b24] hover:underline cursor-pointer font-mono"
                    >
                      Audit gateway Url
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onTriggerTab("accounts")}
              className="w-full py-2 bg-[#f25b24]/5 hover:bg-[#f25b24]/10 border border-[#f25b24]/20 rounded-xl text-xs font-mono font-bold text-[#f25b24] flex items-center justify-center gap-1 cursor-pointer select-none transition-colors"
            >
              <span>Manage Egress Proxies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick-tips info block */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 border-dashed space-y-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
            <h4 className="text-[11px] font-semibold text-slate-800 tracking-wider uppercase font-mono text-left">Primal automation notes</h4>
            <ul className="space-y-1.5 text-[10px] text-slate-400 leading-normal pl-4 list-disc text-left">
              <li>Each browser run utilizes residential SOCKS5 proxies to shield IP boundaries.</li>
              <li>Automation key delays vary by 20% organically to defy heuristic AI detection flags.</li>
              <li>Upload only verified JPEG files matching specific platform resolutions to assure proper grid alignment.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
