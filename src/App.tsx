import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Calendar, 
  Layers, 
  ShieldAlert, 
  Tv, 
  Cpu, 
  BarChart2, 
  Settings, 
  CreditCard, 
  Bell, 
  Flame, 
  LogOut, 
  ChevronRight,
  BookmarkCheck,
  Check,
  RefreshCw,
  Clock,
  ExternalLink
} from "lucide-react";

import { 
  User, 
  SocialAccount, 
  Post, 
  AnalyticsSummary, 
  Platform, 
  PlanType, 
  MediaFile
} from "./types";

// Import modular panels
import PrimalDashboard from "./components/PrimalDashboard";
import PrimalComposer from "./components/PrimalComposer";
import PrimalCalendar from "./components/PrimalCalendar";
import PrimalAccounts from "./components/PrimalAccounts";
import PrimalQueue from "./components/PrimalQueue";
import PrimalAnalytics from "./components/PrimalAnalytics";
import PrimalSettings from "./components/PrimalSettings";
import PrimalBilling from "./components/PrimalBilling";
import PrimalTerminal from "./components/PrimalTerminal";
import PrimalAuthGate from "./components/PrimalAuthGate";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Data State loaded from Express Backend Core API
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  
  // Current logged in user details session (initially null, fetched from /api/auth/me)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [currentPlan, setCurrentPlan] = useState<PlanType>("PRO");

  // Notifications overlay panel
  const [showNotifications, setShowNotifications] = useState(false);

  // Playwright custom emulator terminal state overlays
  const [activeTerminal, setActiveTerminal] = useState<{
    streamId: string;
    title: string;
  } | null>(null);

  // Initialize data from server
  const loadWorkspaceState = async () => {
    try {
      // Fetch users
      const usersRes = await fetch("/api/billing/plans"); // Generic endpoints fallback trigger
      
      const accountsRes = await fetch("/api/workspaces/ws_1/accounts");
      if (accountsRes.ok) {
        const accList = await accountsRes.json();
        setAccounts(accList);
      }

      const postsRes = await fetch("/api/workspaces/ws_1/posts");
      if (postsRes.ok) {
        const postList = await postsRes.json();
        setPosts(postList);
      }

      const mediaRes = await fetch("/api/workspaces/ws_1/media");
      if (mediaRes.ok) {
        const mediaList = await mediaRes.json();
        setMediaFiles(mediaList);
      }

      const notifyRes = await fetch("/api/notifications");
      if (notifyRes.ok) {
        const notifyList = await notifyRes.json();
        setNotifications(notifyList);
      }

      const analyticsRes = await fetch("/api/workspaces/ws_1/analytics/overview");
      if (analyticsRes.ok) {
        const stats = await analyticsRes.json();
        setAnalytics(stats);
      }

      // Prepopulate users hard list
      setUsers([
        {
          id: "usr_1",
          email: "advikatunes@gmail.com",
          firstName: "Thrag",
          lastName: "The Hunter",
          role: "SUPER_ADMIN",
          isVerified: true,
          twoFactorEnabled: true,
          avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=thrag",
          createdAt: new Date().toISOString(),
        },
        {
          id: "usr_2",
          email: "grunt@cavemansocial.com",
          firstName: "Ogg",
          lastName: "Stone-Carver",
          role: "EDITOR",
          isVerified: true,
          twoFactorEnabled: false,
          avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ogg",
          createdAt: new Date().toISOString(),
        }
      ]);

    } catch (err) {
      console.error("Workspace initial bootstrap failed:", err);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          await loadWorkspaceState();
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Auth token check failed:", err);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Failed executing tribal signout:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Post Actions API
  const handleSavePost = async (postData: any) => {
    try {
      const response = await fetch("/api/workspaces/ws_1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        const saved = await response.json();
        await loadWorkspaceState();
        return saved;
      }
    } catch (error) {
      console.error("Failed to compile post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (response.ok) {
        await loadWorkspaceState(); // Refresh states list
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onCancelPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/cancel`, { method: "POST" });
      if (response.ok) {
        await loadWorkspaceState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run immediately: spins up terminal live-stream playback logs!
  const handleRunPostNow = async (postId: string) => {
    const uniqueStreamId = "stream_" + Math.random().toString(36).substr(2, 9);
    
    // Launch terminal overlays first
    setActiveTerminal({
      streamId: uniqueStreamId,
      title: "Playwright Headless Chrome - Web Publishing Automator"
    });

    try {
      // Direct call to triggers immediate publication emulator
      await fetch(`/api/posts/${postId}/publish-now`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId: uniqueStreamId })
      });
    } catch (error) {
      console.error("Failed executing task queue simulation:", error);
    }
  };

  const handleReschedulePost = async (postId: string, newDate: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: newDate })
      });
      if (response.ok) {
        await loadWorkspaceState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Accounts actions trigger APIs
  const handleAddAccount = async (accData: any) => {
    try {
      const response = await fetch("/api/workspaces/ws_1/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accData)
      });
      if (response.ok) {
        const extra = await response.json();
        await loadWorkspaceState();
        return extra;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, { method: "DELETE" });
      if (response.ok) {
        await loadWorkspaceState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verify accounts launches a simulated playwright check
  const handleVerifyAccount = async (accountId: string) => {
    const uniqueStreamId = "stream_" + Math.random().toString(36).substr(2, 9);
    
    // Launch terminal overlays first
    setActiveTerminal({
      streamId: uniqueStreamId,
      title: "Playwright Session Security Validator"
    });

    try {
      await fetch(`/api/accounts/${accountId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId: uniqueStreamId })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onUpgradePlan = (plan: PlanType) => {
    setCurrentPlan(plan);
  };

  // Notifications clean
  const markNotificationRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      if (response.ok) {
        setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", { method: "DELETE" });
      if (response.ok) {
        setNotifications([]);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (authLoading) {
    return (
      <div id="primal-auth-loading" className="min-h-screen bg-[#f8f9fe] flex flex-col items-center justify-center font-sans select-none">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-md flex items-center justify-center animate-bounce">
              <span className="text-3xl">🔥</span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f25b24] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f25b24]"></span>
            </span>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase leading-none font-mono">
              Gathering Clan Fire...
            </h4>
            <p className="text-[10px] text-slate-450 font-mono mt-1.5 uppercase tracking-widest animate-pulse">
              Verifying prehistoric cookies status
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <PrimalAuthGate 
        onAuthSuccess={async (user) => {
          setCurrentUser(user);
          await loadWorkspaceState();
        }} 
      />
    );
  }

  return (
    <div id="caveman-master-container" className="flex h-screen bg-[#f8f9fe] text-slate-700 select-text overflow-hidden font-sans">
      
      {/* 1. LEFT UTILITY MARGIN: NAVIGATION SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none shadow-[2px_0_12px_rgba(0,0,0,0.01)]">
        
        {/* Upper Side: Logo Brand and Navigation elements */}
        <div className="space-y-6">
          
          {/* Logo Brand Brand banner */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="text-xl">🔥</span>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f25b24] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f25b24]"></span>
                </span>
              </div>
              <div className="leading-tight text-left">
                <h1 className="text-sm font-black text-slate-900 font-display uppercase tracking-wider">Caveman</h1>
                <span className="text-[10px] text-[#f25b24] font-mono font-bold leading-none uppercase tracking-widest pl-0.5">Social</span>
              </div>
            </div>

            <span className="text-[8px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold">VS-1.0</span>
          </div>

          {/* Navigation Matrix links */}
          <nav className="px-3.5 space-y-1">
            
            <button
              id="sidebar-nav-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "dashboard" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${activeTab === "dashboard" ? "text-[#f25b24]" : ""}`} />
                <span>Primal Dashboard</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
            </button>

            <button
              id="sidebar-nav-compose"
              onClick={() => setActiveTab("compose")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "compose" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`w-4 h-4 ${activeTab === "compose" ? "text-[#f25b24]" : ""}`} />
                <span>Ignite Composer</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
            </button>

            <button
              id="sidebar-nav-calendar"
              onClick={() => setActiveTab("calendar")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "calendar" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className={`w-4 h-4 ${activeTab === "calendar" ? "text-[#f25b24]" : ""}`} />
                <span>Content Calendar</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
            </button>

            <button
              id="sidebar-nav-accounts"
              onClick={() => setActiveTab("accounts")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "accounts" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <Tv className={`w-4 h-4 ${activeTab === "accounts" ? "text-[#f25b24]" : ""}`} />
                <span>Stealth Socials</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
            </button>

            <button
              id="sidebar-nav-queue"
              onClick={() => setActiveTab("queue")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "queue" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className={`w-4 h-4 ${activeTab === "queue" ? "text-[#f25b24]" : ""}`} />
                <span>BullMQ Queue</span>
              </div>
              <span className="text-[9px] font-mono bg-amber-50 border border-amber-205 text-amber-600 px-1.5 py-0.2 rounded font-bold">Redis</span>
            </button>

            <button
              id="sidebar-nav-analytics"
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "analytics" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart2 className={`w-4 h-4 ${activeTab === "analytics" ? "text-[#f25b24]" : ""}`} />
                <span>Audit Analytics</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
            </button>

            <button
              id="sidebar-nav-billing"
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "billing" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className={`w-4 h-4 ${activeTab === "billing" ? "text-[#f25b24]" : ""}`} />
                <span>Billing Sub</span>
              </div>
              <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1 py-0.2 rounded font-bold font-mono">PRO</span>
            </button>

            <button
              id="sidebar-nav-settings"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold leading-none cursor-pointer transition-all ${activeTab === "settings" ? "bg-[#f25b24]/5 text-[#f25b24] border-l-2 border-[#f25b24]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#f25b24]" : ""}`} />
                <span>Crew Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
            </button>

          </nav>
        </div>

        {/* Lower Side: Current Team Active workspace profile summary */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 font-mono text-[10px]">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar}
              alt="currentUser avatar"
              className="w-10 h-10 rounded-xl object-cover bg-slate-200 border border-slate-205"
              referrerPolicy="no-referrer"
            />
            <div className="text-left select-text">
              <h5 className="font-bold text-slate-900 leading-none whitespace-nowrap overflow-hidden max-w-[125px] truncate">
                {currentUser.firstName} {currentUser.lastName}
              </h5>
              <span className="text-slate-505 block mt-0.5 whitespace-nowrap overflow-hidden max-w-[125px] truncate">
                {currentUser.email}
              </span>
              <span className="text-[#f25b24] text-[8.5px] font-bold block mt-1 uppercase tracking-widest">{currentUser.role}</span>
            </div>
          </div>
        </div>

      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER PANELS */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fe] overflow-hidden">
        
        {/* UPPER CONSOLE BAR: TOPBAR GATEWAYS */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0 select-none shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
          
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold text-slate-500">
            <span className="text-[#f25b24]">WORKSPACE ACTIVE:</span>
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 uppercase rounded text-[10px]">
              Cave Clan Prime
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Live Gemini Status Indicator badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-mono rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-550 animate-pulse"></span>
              <span>Gemini Content Assist active</span>
            </div>

            {/* Notifications Alert Bell Button */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl hover:text-[#f25b24] relative cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#f25b24] text-[8.5px] font-mono text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Menu overlay panel drawer */}
            {showNotifications && (
              <div 
                id="noti-overlay" 
                className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-50 text-left font-mono space-y-3"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-900 uppercase">Primal Alert Streams</span>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-[9px] text-[#f25b24] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {notifications.map((not) => (
                    <div 
                      key={not.id}
                      onClick={() => markNotificationRead(not.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${not.isRead ? "bg-slate-50/50 border-slate-100 opacity-60" : "bg-slate-50 border-slate-200"}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-bold ${not.type === "PUBLISH_SUCCESS" ? "text-emerald-600" : "text-rose-600"}`}>
                          {not.type === "PUBLISH_SUCCESS" ? "[SUCCESS]" : "[ALERT]"}
                        </span>
                        <span className="text-[8px] text-slate-400">{new Date(not.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-[10px] font-bold text-slate-800 mt-1 leading-tight">{not.title}</h4>
                      <p className="text-[9.2px] text-slate-500 truncate mt-0.5">{not.message}</p>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <p className="text-slate-405 text-[10px] py-4 text-center">No active signals.</p>
                  )}
                </div>
              </div>
            )}

            {/* Logout mockup */}
            <button 
              onClick={handleLogout}
              className="p-2 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100/60 rounded-xl cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* MAIN BODY OF CURRENT PANEL ACTIVE VIEW */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8f9fe]">
          
          {/* Dashboard Panel Tab view */}
          {activeTab === "dashboard" && (
            <PrimalDashboard 
              summary={analytics.summary || { totalPosts: posts.length, published: 2, scheduled: 2, failed: 0, connectedAccounts: accounts.length, successRate: 100 }}
              posts={posts}
              accounts={accounts}
              auditLogs={analytics.auditLogs || []}
              onTriggerTab={setActiveTab}
              onRunPostNow={handleRunPostNow}
            />
          )}

          {/* Composer and AI Writer assistant View */}
          {activeTab === "compose" && (
            <PrimalComposer 
              onSavePost={handleSavePost}
              onTriggerTab={setActiveTab}
              mediaFiles={mediaFiles}
            />
          )}

          {/* Dynamic Interactive Month Calendar View */}
          {activeTab === "calendar" && (
            <PrimalCalendar 
              posts={posts}
              onReschedulePost={handleReschedulePost}
              onRunPostNow={handleRunPostNow}
              onDeletePost={handleDeletePost}
              onTriggerTab={setActiveTab}
            />
          )}

          {/* Connected Handles Sessions Manager View */}
          {activeTab === "accounts" && (
            <PrimalAccounts 
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onDeleteAccount={handleDeleteAccount}
              onVerifyAccount={handleVerifyAccount}
            />
          )}

          {/* Scheduled delays queue manager View */}
          {activeTab === "queue" && (
            <PrimalQueue 
              onTriggerTab={setActiveTab}
              onRunPostNow={handleRunPostNow}
              onCancelPost={onCancelPost}
            />
          )}

          {/* Graphical Analytics Conversions Reports view */}
          {activeTab === "analytics" && (
            <PrimalAnalytics 
              stats={analytics}
              accounts={accounts}
            />
          )}

          {/* Security active users switch view */}
          {activeTab === "settings" && (
            <PrimalSettings 
              users={users}
            />
          )}

          {/* Subscriptions tiers picker view */}
          {activeTab === "billing" && (
            <PrimalBilling 
              currentPlan={currentPlan}
              onUpgradePlan={onUpgradePlan}
              limits={{
                accountsCount: accounts.length,
                postsCount: posts.length
              }}
            />
          )}

        </main>
      </div>

      {/* 3. FLOATING OVERLAYS WINDOW: PLAYWRIGHT DIAGNOSTIC CONSOLE STREAM */}
      {activeTerminal && (
        <PrimalTerminal 
          streamId={activeTerminal.streamId}
          title={activeTerminal.title}
          onClose={() => {
            // Hot reload workspace state on closing the log screen to capture update statuses immediately
            loadWorkspaceState(); 
            setActiveTerminal(null);
          }}
        />
      )}

    </div>
  );
}
