import React, { useState } from "react";
import { 
  Flame, 
  Lock, 
  Mail, 
  UserPlus, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  Compass,
  Smile
} from "lucide-react";
import { User } from "../types";

interface PrimalAuthGateProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = "LOGIN" | "SIGNUP";

export default function PrimalAuthGate({ onAuthSuccess }: PrimalAuthGateProps) {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration specific states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("thrag");
  const [role, setRole] = useState("EDITOR");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedSeeds = [
    { name: "Thrag", seed: "thrag", desc: "The Hunter" },
    { name: "Ogg", seed: "ogg", desc: "Stone Carver" },
    { name: "Grog", seed: "grog", desc: "Spear Maker" },
    { name: "Gork", seed: "gork", desc: "Art Shaman" },
    { name: "Lula", seed: "lula", desc: "Gatherer Lead" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "LOGIN" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "LOGIN" 
        ? { email, password } 
        : { 
            email, 
            password, 
            firstName, 
            lastName, 
            role,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}` 
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Grab another flint!");
      }

      if (data.authenticated && data.user) {
        onAuthSuccess(data.user);
      } else {
        throw new Error("Invalid response format from the cave server.");
      }
    } catch (err: any) {
      console.error("Authentication submission error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="primal-auth-master" className="min-h-screen bg-[#f8f9fe] flex flex-col justify-center py-12 sm:px-6 lg:px-8 select-text font-sans relative overflow-hidden">
      
      {/* Dynamic burning background vectors for pre-historic feel */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#f25b24]/5 to-transparent blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-amber-500/5 to-transparent blur-3xl rounded-full"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Core logo presentation */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-2xl shadow-md flex items-center justify-center relative transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-3xl">🔥</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f25b24] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f25b24]"></span>
            </span>
          </div>
          
          <h2 className="mt-4 text-center text-2xl font-black text-slate-900 font-display tracking-tight uppercase leading-none">
            Caveman Social
          </h2>
          <span className="mt-1 text-[10.5px] font-mono font-bold uppercase text-[#f25b24] tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-lg shadow-sm">
            Primal Social Scheduler & Cookie Hijacker
          </span>
        </div>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Main interactive form card */}
        <div className="bg-white py-8 px-4 border border-slate-200/85 rounded-2xl shadow-xl sm:px-10">
          
          {/* Sub tabs switches */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              onClick={() => {
                setMode("LOGIN");
                setError(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "LOGIN" 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-150" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#f25b24]" />
              <span>Enter Fireplace</span>
            </button>
            <button
              onClick={() => {
                setMode("SIGNUP");
                setError(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "SIGNUP" 
                  ? "bg-white text-slate-900 shadow-sm border border-slate-150" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#f25b24]" />
              <span>Join Clan Tribe</span>
            </button>
          </div>

          {/* User Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-shake font-mono text-left leading-normal">
              <span className="text-rose-500 shrink-0 font-bold select-none">[!]</span>
              <span>{error}</span>
            </div>
          )}

          {/* Main Action Form submission */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {mode === "SIGNUP" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ogg"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stonecarver"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400 font-sans"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Cave Communication Email</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. advikatunes@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400 font-sans"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Primal Access Code (Password)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-[#f25b24] hover:underline font-mono"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5 inline mr-0.5" /> : <Eye className="w-3.5 h-3.5 inline mr-0.5" />}
                  <span>{showPassword ? "Hide" : "Reveal"}</span>
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={mode === "LOGIN" ? "e.g. hunter123" : "Min 4 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400 font-sans"
              />
            </div>

            {mode === "SIGNUP" && (
              <>
                {/* Seed selection avatar */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Choose Avatar Seed</span>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {predefinedSeeds.map((ps) => {
                      const active = avatarSeed === ps.seed;
                      return (
                        <button
                          key={ps.seed}
                          type="button"
                          onClick={() => setAvatarSeed(ps.seed)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-left shrink-0 cursor-pointer ${
                            active 
                              ? "border-[#f25b24] bg-[#f25b24]/5" 
                              : "border-slate-200 bg-slate-50/40 hover:border-slate-400"
                          }`}
                        >
                          <img 
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${ps.seed}`} 
                            alt={ps.name}
                            className="w-6 h-6 rounded bg-slate-100"
                          />
                          <div className="font-mono leading-none">
                            <span className="text-[9.5px] font-bold block text-slate-800">{ps.name}</span>
                            <span className="text-[7.5px] text-slate-400">{ps.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Role selection dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Tribe Operational Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none font-mono"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Tribe Chieftain)</option>
                    <option value="EDITOR">EDITOR (Stone Scraper)</option>
                    <option value="ANALYST">ANALYST (Camp Accountant)</option>
                  </select>
                </div>
              </>
            )}

            {mode === "LOGIN" && (
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                <div className="flex items-center gap-1 select-none">
                  <input type="checkbox" id="remember-me" defaultChecked className="rounded border-slate-300 text-[#f25b24] focus:ring-[#f25b24]" />
                  <label htmlFor="remember-me" className="cursor-pointer">Maintain fire burning</label>
                </div>
                <div className="text-slate-450 hover:text-slate-700">Forgot Code? Ask Shaman</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#f25b24] hover:bg-[#d64a18] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 select-none cursor-pointer transition-all uppercase tracking-wider shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Chanting fire spell..." : mode === "LOGIN" ? "Authorize Prehistoric Session" : "Claim Clan Seat"}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

          </form>

          {/* Quick instructions and helper details to expedite testing */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-left font-mono text-[9px] text-slate-450 space-y-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-700 uppercase">Interactive Testing Seeds:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[8px] font-bold text-slate-600 block leading-tight">Chieftain Thrag:</span>
                <span className="text-slate-500 block">advikatunes@gmail.com</span>
                <span className="text-[#f25b24] font-bold">hunter123</span>
              </div>
              <div>
                <span className="text-[8px] font-bold text-slate-600 block leading-tight">Stone Carver Ogg:</span>
                <span className="text-slate-500 block">grunt@cavemansocial.com</span>
                <span className="text-[#f25b24] font-bold">hunter123</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer legalities or credentials status info */}
        <div className="mt-4 text-center text-[10px] font-mono text-slate-400 select-none">
          <span>By continuing, you agree to feed the campfire. Keep the beast outside away.</span>
        </div>

      </div>

    </div>
  );
}
