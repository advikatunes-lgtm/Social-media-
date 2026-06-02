import React, { useState } from "react";
import { 
  Tv, 
  Link2, 
  Lock, 
  RefreshCw, 
  Globe, 
  Trash2, 
  Terminal, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle,
  FileCode,
  Info,
  Chrome,
  Key
} from "lucide-react";
import { SocialAccount, Platform } from "../types";
import PrimalSocialLogin from "./PrimalSocialLogin";

interface PrimalAccountsProps {
  accounts: SocialAccount[];
  onAddAccount: (accData: any) => Promise<any>;
  onDeleteAccount: (accountId: string) => void;
  onVerifyAccount: (accountId: string) => void;
}

export default function PrimalAccounts({
  accounts,
  onAddAccount,
  onDeleteAccount,
  onVerifyAccount
}: PrimalAccountsProps) {
  const [connectMethod, setConnectMethod] = useState<"LOGIN_GATE" | "MANUAL_COOKIE">("LOGIN_GATE");
  const [platform, setPlatform] = useState<Platform>("TWITTER");
  const [accountName, setAccountName] = useState("");
  const [accountHandle, setAccountHandle] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");

  const [formLoading, setFormLoading] = useState(false);

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "INSTAGRAM": return "IG";
      case "TWITTER": return "𝕏";
      case "LINKEDIN": return "IN";
      case "YOUTUBE": return "YT";
      case "FACEBOOK": return "FB";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName || !accountHandle) return;

    setFormLoading(true);
    try {
      await onAddAccount({
        platform,
        accountName,
        accountHandle,
        proxyUrl: proxyUrl || undefined
      });

      // Clear setup
      setAccountName("");
      setAccountHandle("");
      setProxyUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div id="primal-accounts-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-slate-605 select-text text-left items-start">
      
      {/* LEFT COLUMN: ACTIVE SESSIONS (Col-span 6) */}
      <div className="lg:col-span-6 space-y-6">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="space-y-0.5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#f25b24]" />
              <span>Active Prehistoric Browser Sessions</span>
            </h2>
            <p className="text-[10px] text-slate-500">Playwright stealth nodes mapping encrypted sessions cookies</p>
          </div>

          <div className="space-y-4">
            {accounts.map((acc) => (
              <div 
                key={acc.id}
                className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
              >
                
                {/* Account details info card */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={acc.accountAvatar} 
                      alt={acc.accountName} 
                      className="w-12 h-12 rounded-xl object-cover bg-slate-200 border border-slate-205"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-[8.5px] text-[#f25b24] border border-[#f25b24]/30 font-bold font-mono flex items-center justify-center shadow-sm">
                      {getPlatformIcon(acc.platform)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-none">{acc.accountName}</h4>
                      {acc.sessionValid ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 text-[8px] font-mono font-bold leading-none">
                          COOKIE ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-[8px] font-mono font-bold">
                          EXPIRED (RECONNECT)
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10.5px] text-slate-400 font-mono">@{acc.accountHandle || "unknown"}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-cyan-600" />
                        <span>IP Proxy: {acc.proxyUrl || "Dynamic Primal Egresspool"}</span>
                      </span>
                      {acc.lastVerified && (
                        <span className="text-slate-400">• Last verified: {new Date(acc.lastVerified).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions indicators */}
                <div className="flex items-center gap-2.5 sm:self-center self-end">
                  <button
                    onClick={() => onVerifyAccount(acc.id)}
                    className="px-3.5 py-2 bg-amber-50 border border-amber-200 hover:bg-[#f25b24] hover:text-white text-amber-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Audit browser verification check"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Verify (Sim)</span>
                  </button>

                  <button
                    onClick={() => onDeleteAccount(acc.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200/60 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
            
            {accounts.length === 0 && (
              <div className="text-center p-8 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl opacity-60">🦖</span>
                <h4 className="text-xs font-bold text-slate-400 uppercase font-mono">No Active Browser Sessions Linked</h4>
                <p className="text-[10px] text-slate-500 max-w-sm">Use the connection gates on the right to link your Instagram, Twitter/X, or Facebook accounts with cookie support.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: RE-TARGETED TO BOTH PREFER SOCIAL LOGIN & MANUAL INJECTION (Col-span 6) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Method selection Switch toggler tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#f25b24]" />
            <span className="text-xs font-bold font-mono text-slate-800 uppercase select-none">Connect social hub</span>
          </div>

          <div className="bg-slate-100/80 border border-slate-200/50 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setConnectMethod("LOGIN_GATE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 cursor-pointer transition-all ${
                connectMethod === "LOGIN_GATE" 
                  ? "bg-[#f25b24] text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>Social Login Page</span>
            </button>
            <button
              onClick={() => setConnectMethod("MANUAL_COOKIE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 cursor-pointer transition-all ${
                connectMethod === "MANUAL_COOKIE" 
                  ? "bg-[#f25b24] text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Cookie Injection</span>
            </button>
          </div>
        </div>

        {/* Conditional Component Rendering based on choice */}
        {connectMethod === "LOGIN_GATE" ? (
          <PrimalSocialLogin 
            onAddAccount={onAddAccount} 
            onSuccess={() => {}}
          />
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm">
            
            <div className="space-y-0.5 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <Key className="w-4 h-4 text-[#f25b24]" />
                <span>Manual session injection gate</span>
              </h2>
              <p className="text-[10px] text-slate-400 leading-normal">Inject session states bypassing standard verification gates</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Select Target Platform</label>
                <select
                  value={platform}
                  onChange={(e: any) => setPlatform(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none"
                >
                  <option value="TWITTER">Twitter / X</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="FACEBOOK">Facebook</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Profile Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. My Spear shop IG page"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Account Handle (@)</label>
                <input 
                  type="text" 
                  placeholder="e.g. spear_grog"
                  required
                  value={accountHandle}
                  onChange={(e) => setAccountHandle(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Dedicated proxy URL (Socks5)</label>
                <input 
                  type="text" 
                  placeholder="socks5://username:pass@185.22.41.11:1080"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-2.5 text-xs text-slate-850 outline-none placeholder-slate-400 font-mono text-[10.5px]"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex gap-2 items-start text-[9.5px] text-slate-500 leading-relaxed font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#f25b24] shrink-0" />
                  <span>
                    To bypass 2FA obstacles, our engine intercepts sessions via cookie injection. Under production, upload decrypted session key JSONs.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 bg-[#f25b24] hover:bg-[#d64a18] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 select-none cursor-pointer uppercase font-mono tracking-wider shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{formLoading ? "Deploying Engine..." : "Inject Session cookies"}</span>
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
