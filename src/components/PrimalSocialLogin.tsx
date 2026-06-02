import React, { useState, useEffect } from "react";
import { 
  Tv, 
  Chrome, 
  Lock, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Globe, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Smartphone,
  CheckCircle2,
  Terminal,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { Platform } from "../types";

interface PrimalSocialLoginProps {
  onAddAccount: (accData: any) => Promise<any>;
  onSuccess?: () => void;
}

type Step = "CREDENTIALS" | "CONNECTING" | "SUCCESS";

export default function PrimalSocialLogin({ onAddAccount, onSuccess }: PrimalSocialLoginProps) {
  const [platform, setPlatform] = useState<Platform>("TWITTER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [proxyUrl, setProxyUrl] = useState("socks5://egress-us-west.primalproxies.io:8080");
  const [bypass2FA, setBypass2FA] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  
  const [currentStep, setCurrentStep] = useState<Step>("CREDENTIALS");
  const [logLines, setLogLines] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Platform styling helpers
  const getPlatformColors = (plat: Platform) => {
    switch (plat) {
      case "TWITTER":
        return {
          bg: "bg-[#000000]",
          border: "border-slate-800",
          text: "text-white",
          accent: "#1da1f2",
          btnBg: "bg-white text-black hover:bg-slate-200",
          avatarColor: "bg-zinc-800",
          url: "https://x.com/i/flow/login",
          title: "Twitter / X Secure Gate"
        };
      case "INSTAGRAM":
        return {
          bg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
          border: "border-slate-800",
          text: "text-white",
          accent: "#e1306c",
          btnBg: "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90",
          avatarColor: "bg-pink-900/40",
          url: "https://instagram.com/accounts/login",
          title: "Instagram Secure Gate"
        };
      case "LINKEDIN":
        return {
          bg: "bg-[#0077b5]",
          border: "border-slate-800",
          text: "text-white",
          accent: "#0077b5",
          btnBg: "bg-[#0077b5] text-white hover:bg-[#006296]",
          avatarColor: "bg-blue-950/40",
          url: "https://linkedin.com/checkpoint/lg/login",
          title: "LinkedIn Corporate Gate"
        };
      case "YOUTUBE":
        return {
          bg: "bg-[#ff0000]",
          border: "border-slate-800",
          text: "text-white",
          accent: "#ff0000",
          btnBg: "bg-[#ff0000] text-white hover:bg-[#cc0000]",
          avatarColor: "bg-red-950/40",
          url: "https://accounts.google.com/signin/v2/identifier",
          title: "Google / YouTube OAuth Portal"
        };
      case "FACEBOOK":
        return {
          bg: "bg-[#1877f2]",
          border: "border-slate-800",
          text: "text-white",
          accent: "#1877f2",
          btnBg: "bg-[#1877f2] text-white hover:bg-[#166fe5]",
          avatarColor: "bg-blue-900/40",
          url: "https://facebook.com/login",
          title: "Facebook Account Gate"
        };
    }
  };

  const activeBranding = getPlatformColors(platform);

  // Playwright automated browser connection step-by-step logs simulation
  const simulationLogs = [
    `[STEALTH CORE] Launching Chromium instance with stealth-evasion patches...`,
    `[STEALTH CORE] Targeting SOCKS5 egress point: ${proxyUrl || "Dynamic Pool IP"}`,
    `[BROWSER ENGINE] Proxy bound successfully. IP geolocation validated.`,
    `[BROWSER ENGINE] Directing browser viewport to: ${activeBranding.url}`,
    `[STEALTH CONFIG] Bypassing fingerprint analyzers (WebGL, canvas, user-agent customized)`,
    `[PAGE LOAD] Navigation complete. Status: 200 OK. Rendering sign-in context.`,
    `[DOM AGENT] Intercepted credentials fields. Injecting username: ${username}`,
    `[DOM AGENT] Inputting password safely via keystroke variance simulation (75ms deviation)...`,
    `[STEALTH WORKER] Submitting credentials form payload...`,
    `[AUTH CHALLENGE] Capturing response status: Intercepted potential verification overlay.`,
    bypass2FA 
      ? `[STEALTH WORKER] 2FA Auto-Intercept enabled. Simulating secure authentication token matching...`
      : `[STEALTH WORKER] Submitting 2FA security validation code: ${otpCode || "983204"}`,
    `[SESSION MATCH] Credentials authorized by security registry!`,
    `[SESSION MEMORY] Gathering cookie storage jar: encrypted session keys extracted successfully.`,
    `[COOKIE HARVESTER] Session validation passed. Injecting verified active status flag into Caveman Social!`,
    `[STEALTH CORE] Terminating automated chromium worker. Connection fully bound.`
  ];

  const handleStartLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setCurrentStep("CONNECTING");
    setLogLines([]);
    setLogIndex(0);
    setIsDone(false);
  };

  useEffect(() => {
    if (currentStep !== "CONNECTING") return;

    if (logIndex < simulationLogs.length) {
      const delay = logIndex === 0 ? 300 : logIndex === 7 ? 1200 : logIndex === 10 ? 1500 : 400;
      const timeout = setTimeout(() => {
        setLogLines((prev) => [...prev, simulationLogs[logIndex]]);
        setLogIndex(logIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // Logic completed! Deploy session to backend
      setIsDone(true);
      const finalizeConnection = async () => {
        try {
          const cleanHandle = username.startsWith("@") ? username.substring(1) : username;
          await onAddAccount({
            platform,
            accountName: `${platform.charAt(0) + platform.slice(1).toLowerCase()} Professional Agent`,
            accountHandle: cleanHandle,
            proxyUrl: proxyUrl || undefined
          });
          
          setTimeout(() => {
            setCurrentStep("SUCCESS");
          }, 1000);
        } catch (err) {
          console.error("Failed adding simulated social media login:", err);
          setCurrentStep("CREDENTIALS");
        }
      };
      finalizeConnection();
    }
  }, [currentStep, logIndex]);

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setOtpCode("");
    setCurrentStep("CREDENTIALS");
    setIsDone(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div id="primal-social-login-gate" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all text-slate-700">
      
      {/* 1. Header simulation representing the Playwright Automation Browser Headless Screen */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between font-mono text-[11px] text-slate-600 select-none">
        <div className="flex items-center gap-1.5 matches-tab-branding font-semibold">
          <div className="flex items-center gap-1 shrink-0 mr-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </div>
          <Chrome className="w-4 h-4 text-slate-500" />
          <span className="text-slate-700 truncate max-w-[200px] md:max-w-none">
            {currentStep === "CREDENTIALS" ? `Headless Sandbox: Sign In Gateway` : `Automation Cluster Run: active_node#7`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentStep === "CONNECTING" && (
            <span className="flex items-center gap-1 text-[#f25b24] text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#f25b24] animate-ping"></span>
              <span>LIVE SCRAPE ENGINE RUNNING</span>
            </span>
          )}
          <span className="text-[10px] bg-slate-200 border border-slate-300 px-2 py-0.5 rounded text-slate-700 uppercase font-bold text-right leading-none font-mono">
            {platform}
          </span>
        </div>
      </div>

      {/* Mock browser address bar navigation */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-400">
          <button disabled className="p-1 hover:text-slate-800 transition duration-150 rounded cursor-not-allowed">←</button>
          <button disabled className="p-1 hover:text-slate-800 transition duration-150 rounded cursor-not-allowed">→</button>
          <button disabled className="p-1 hover:text-slate-800 transition duration-150 rounded cursor-not-allowed">⟳</button>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center justify-between text-[10.5px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-emerald-600 text-[9px] font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 font-sans">SECURE SSL</span>
            <span className="text-slate-600 select-all truncate">{activeBranding.url}</span>
          </div>
          <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
        </div>
      </div>

      {/* Main Switch steps layouts */}
      <div className="p-6">
        
        {currentStep === "CREDENTIALS" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left credentials submission module (col-span 7) */}
            <form onSubmit={handleStartLogin} className="md:col-span-7 space-y-4 text-left">
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Sign In & Extract Cookie Session</span>
                </h3>
                <p className="text-[10.5px] text-slate-500 leading-normal font-sans">
                  Submit credentials through our sandboxed environment. Your password is used live locally on the official platform sign-in form inside Chrome and directly discarded, never saved or transmitted through our servers.
                </p>
              </div>

              {/* Selector top row options */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Target Platform Network</label>
                <div className="grid grid-cols-5 gap-2">
                  {(["TWITTER", "INSTAGRAM", "LINKEDIN", "FACEBOOK", "YOUTUBE"] as Platform[]).map((p) => {
                    const active = platform === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`py-2 rounded-xl text-center text-xs font-bold font-mono transition-all border ${
                          active 
                            ? "bg-[#f25b24]/10 text-[#f25b24] border-[#f25b24] shadow-sm" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950"
                        }`}
                      >
                        {p === "TWITTER" ? "𝕏" : p === "INSTAGRAM" ? "IG" : p === "LINKEDIN" ? "IN" : p === "YOUTUBE" ? "YT" : "FB"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Handle or Sign-in Email</label>
                  <input 
                    type="text" 
                    placeholder="e.g. spear_hunter@gmail.com"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/35 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <label className="text-slate-400 uppercase font-semibold">Account Password</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#f25b24] hover:underline"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5 inline mr-0.5" /> : <Eye className="w-3.5 h-3.5 inline mr-0.5" />}
                      <span>{showPassword ? "Hide" : "Reveal"}</span>
                    </button>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/35 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Bot bypass configuration parameters */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#f25b24]" />
                    <span>Bot Bypass Controls</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-mono text-emerald-600 uppercase font-bold">Stealth.js Shield Active</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-mono text-slate-450 uppercase font-semibold text-left block">Residential Proxy URL</label>
                    <input 
                      type="text" 
                      placeholder="socks5://egress-us-west.primalproxies.io:8080"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-600 outline-none placeholder-slate-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-start gap-1.5">
                      <input 
                        type="checkbox" 
                        id="bypass2fa-check" 
                        checked={bypass2FA}
                        onChange={(e) => setBypass2FA(e.target.checked)}
                        className="mt-0.5 border-slate-300 rounded text-[#f25b24] focus:ring-[#f25b24]"
                      />
                      <label htmlFor="bypass2fa-check" className="text-[10.5px] font-mono text-slate-500 select-none text-left leading-normal">
                        Auto intercept/simulate 2FA algorithms
                      </label>
                    </div>
                  </div>

                  {!bypass2FA && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[9.5px] font-mono text-slate-450 uppercase font-semibold text-left block">Manual OTP / Authenticator Backup Seed</label>
                      <input 
                        type="text" 
                        placeholder="e.g. YH2D 8JD2 KSU3 I7DY"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-800 outline-none uppercase tracking-widest placeholder-slate-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Warnings and compliance */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[9.5px] font-mono text-slate-500 flex items-start gap-2 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Our connection mimics standard Android/Chrome user agent strings under a randomized residential network block. This minimizes security flags from platforms like Instagram or Twitter.
                </span>
              </div>

              <button
                type="submit"
                className={`w-full py-3 ${activeBranding.btnBg} text-xs font-bold rounded-xl flex items-center justify-center gap-2 select-none cursor-pointer transition-all uppercase tracking-wider shadow-sm`}
              >
                <span>Authorize & Extract Session Hook</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Right side interactive mockup representation (col-span 5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 h-[390px] overflow-hidden flex flex-col justify-between shadow-inner">
                
                {/* Visual phone-style frame background gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f25b24]/5 to-transparent blur-2xl rounded-full"></div>
                
                {/* Frame Heading */}
                <div className="border-b border-slate-200 pb-3 flex items-center gap-2 select-none relative z-10">
                  <Smartphone className="w-4 h-4 text-slate-450" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Device Emulation Stage</span>
                </div>

                {/* Simulated Social Network Sign-In UI card */}
                <div className="my-auto space-y-4 relative z-10 flex-1 flex flex-col justify-center items-center py-6">
                  
                  {/* Platform rounded logo icon representation */}
                  <div className={`w-14 h-14 rounded-2xl ${activeBranding.bg} flex items-center justify-center shadow-md transform rotate-3 hover:rotate-0 transition duration-300`}>
                    <span className="text-white font-extrabold text-2xl font-display uppercase tracking-tighter select-none">
                      {platform === "TWITTER" ? "𝕏" : platform === "INSTAGRAM" ? "IG" : platform === "LINKEDIN" ? "IN" : platform === "YOUTUBE" ? "YT" : "FB"}
                    </span>
                  </div>

                  <div className="text-center space-y-1.5 select-none">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight uppercase font-mono tracking-wide">
                      {activeBranding.title}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Port: 3000 • Protocol: SSL Handshake
                    </p>
                  </div>

                  <div className="w-full space-y-2 border border-slate-200 p-4 bg-white/90 rounded-xl font-mono text-[9.5px]">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-400">
                      <span>EMU DEVICE</span>
                      <span>Chrome 118 x64_OS</span>
                    </div>

                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">USER:</span>
                      <span className="text-slate-850 truncate max-w-[120px] font-semibold">{username || "[Awaiting input]"}</span>
                    </div>

                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">PASS:</span>
                      <span className="text-slate-850 font-semibold">{password ? "••••••••" : "[Awaiting input]"}</span>
                    </div>

                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">SOCKS PROXY:</span>
                      <span className="text-cyan-600 font-semibold truncate max-w-[110px]">{proxyUrl ? "CONNECTED" : "None"}</span>
                    </div>
                  </div>

                </div>

                {/* Footer status indicating waiting */}
                <div className="border-t border-slate-200 pt-3 relative z-10 flex items-center justify-between text-[9px] font-mono text-slate-450 select-none">
                  <span className="flex items-center gap-1 uppercase font-bold text-emerald-600">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Emu Ready</span>
                  </span>
                  <span>v1.0.4-Stealth</span>
                </div>

              </div>
            </div>

          </div>
        )}

        {currentStep === "CONNECTING" && (
          <div className="space-y-6 text-left">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-center gap-5 justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#f25b24]/5 border border-[#f25b24]/20 rounded-xl relative">
                  <RefreshCw className="w-6 h-6 text-[#f25b24] animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span>Processing Stealth Login Session Connection</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Playwright is spawning a residential Chrome daemon to authenticate at <strong className="text-slate-800">{username}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-3 py-1 bg-amber-50 border border-amber-250 text-amber-700 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider">
                  Working (Step {logIndex} of {simulationLogs.length})
                </span>
              </div>
            </div>

            {/* Terminal simulation log lines wrapper */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 font-mono text-[10.5px] text-zinc-300 space-y-2 h-[280px] overflow-y-auto select-text shadow-sm">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-3 text-zinc-500">
                <Terminal className="w-4 h-4 text-[#f25b24]" />
                <span className="uppercase font-bold tracking-wide">Playwright Scraper Stdout Pipeline</span>
              </div>

              {logLines.map((line, idx) => {
                const isError = line.includes("ERR");
                const isSuccess = line.includes("SUCCESS") || line.includes("successfully") || line.includes("passed");
                return (
                  <div key={idx} className="flex gap-2 items-start animate-fade-in py-0.5 leading-relaxed">
                    <span className="text-[#f25b24] shrink-0 font-bold select-none">&gt;</span>
                    <span className={isError ? "text-red-400 font-bold" : isSuccess ? "text-emerald-400 font-semibold" : "text-zinc-300"}>
                      {line}
                    </span>
                  </div>
                );
              })}

              {/* Auto Scroll indicator bar */}
              <div className="text-zinc-500 text-[10px] animate-pulse py-1 select-none flex items-center gap-1.5 font-bold">
                {!isDone ? (
                  <>
                    <span className="w-1.5 h-3 bg-[#f25b24] inline-block animate-blink"></span>
                    <span>Awaiting browser stream feedback...</span>
                  </>
                ) : (
                  <span className="text-emerald-400 font-black">✔ WRITER EXECUTION FINISHED SUCCESSFULLY</span>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === "SUCCESS" && (
          <div className="py-12 px-6 text-center space-y-6 max-w-lg mx-auto">
            
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-tight">
                Authentication Session Linked!
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Credentials successfully intercepted by the prehistoric background crawler. Encrypted cookie jars are saved and activated for the account handle: <strong className="text-[#f25b24] font-mono font-black text-xs">@{username}</strong> ({platform}).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex gap-3 text-left">
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 font-mono text-[10px] leading-relaxed">
                <span className="font-bold text-slate-850 uppercase block">Stealth Connection Guard State:</span>
                <p className="text-slate-505">
                  Cookie token stored matching <strong className="text-slate-705">Session ID {Math.random().toString(36).substr(2, 10).toUpperCase()}</strong>. Future content drafts will be published instantly bypassing anti-bot challenge rules.
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#f25b24] hover:bg-[#d64a18] text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all shadow-sm select-none cursor-pointer"
            >
              Continue to Sessions Manager
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
