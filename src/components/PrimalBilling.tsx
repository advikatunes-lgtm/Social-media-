import React, { useState } from "react";
import { 
  Tv, 
  Layers, 
  Cpu, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  RefreshCw,
  Award
} from "lucide-react";
import { PlanType } from "../types";

interface PrimalBillingProps {
  currentPlan: PlanType;
  onUpgradePlan: (plan: PlanType) => void;
  limits: {
    accountsCount: number;
    postsCount: number;
  };
}

export default function PrimalBilling({ currentPlan, onUpgradePlan, limits }: PrimalBillingProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "STARTER" as PlanType,
      name: "Starter Clan",
      price: "$29",
      period: "/ month",
      accountsLimit: 5,
      postsLimit: 30,
      badge: "Indie Hunter",
      features: [
        "Up to 5 Social Accounts",
        "30 posts publishing / month",
        "Primal queue system (No worker concurrency)",
        "Standard caption composer (Text-only)",
        "No API keys needed"
      ]
    },
    {
      id: "PRO" as PlanType,
      name: "Pro Chieftain",
      price: "$79",
      period: "/ month",
      accountsLimit: 15,
      postsLimit: 200,
      badge: "Most Popular",
      features: [
        "Up to 15 Social Accounts",
        "200 posts compiling / month",
        "Dedicated SOCKS5 proxies pool config",
        "Full Gemini caption generator access",
        "BullMQ concurrency 2-slots workers",
        "Detailed browser verification logs logs"
      ]
    },
    {
      id: "AGENCY" as PlanType,
      name: "Agency Shaman",
      price: "$249",
      period: "/ month",
      accountsLimit: 100,
      postsLimit: 1000,
      badge: "Elite Master",
      features: [
        "Up to 100 Social Accounts",
        "1000 posts publishing / month",
        "Unlimited Workspace Teams invitation",
        "White-label branding domains support",
        "Premium static IP regional routing",
        "24/7 Priority support hotline"
      ]
    }
  ];

  const handleSelectUpgrade = async (plan: PlanType) => {
    setLoadingPlan(plan);
    // Simulate payment loading gateways drawer
    await new Promise((r) => setTimeout(r, 1500));
    onUpgradePlan(plan);
    setLoadingPlan(null);
    alert(`Primal subscription upgraded successfully! Active tier is now: ${plan}`);
  };

  return (
    <div id="primal-billing-root" className="space-y-6 animate-fade-in text-slate-700 select-text text-left">
      
      {/* billing description card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-orange-50/70 to-amber-50/70 border border-[#f25b24]/20 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#f25b24]" />
            <span>Active Tier: {currentPlan} Chieftain</span>
          </h2>
          <p className="text-[10px] text-slate-600 font-sans">
            Current limits usage: <strong className="text-[#f25b24] font-extrabold">{limits.accountsCount} active social slots</strong> used, <strong className="text-slate-800 font-semibold">{limits.postsCount} posts in calendar</strong>.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-[#f25b24]/10 text-[#f25b24] border border-[#f25b24]/20 rounded-xl text-xs font-bold font-mono shadow-sm">
          SECURE PAYMENTS STRIPE-COMPLIANT
        </span>
      </div>

      {/* THREE PLAN COLUMNS COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isActive = p.id === currentPlan;
          return (
            <div 
              key={p.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden shadow-sm ${
                isActive 
                  ? "border-[#f25b24] ring-1 ring-[#f25b24]/10 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#f25b24]" 
                  : "border-slate-200"
              }`}
            >
              
              {/* Header plan label */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-mono font-bold text-[#f25b24] tracking-wider uppercase bg-[#f25b24]/5 px-2 py-0.5 rounded border border-[#f25b24]/15 whitespace-nowrap">
                      {p.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-850 pt-1.5">{p.name}</h3>
                  </div>

                  <div className="text-right leading-none">
                    <div className="text-2xl font-bold font-display text-slate-900">{p.price}</div>
                    <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 inline-block">{p.period}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 py-1.5 border-y border-slate-100 flex justify-between">
                  <span>Accounts Slots: <strong className="text-slate-800 font-bold">{p.accountsLimit}</strong></span>
                  <span>Max Posts: <strong className="text-slate-800 font-bold">{p.postsLimit}</strong></span>
                </div>

                {/* Features checkboxes */}
                <ul className="space-y-2.5 text-[10.5px] text-slate-600">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex gap-2 items-start leading-tight">
                      <Check className="w-3.5 h-3.5 text-[#f25b24] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action upgrade select button */}
              <div>
                {isActive ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1 cursor-default select-none uppercase"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>No Action - Active plan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectUpgrade(p.id)}
                    disabled={loadingPlan !== null}
                    className="w-full py-2.5 bg-[#f25b24] hover:bg-[#d64a18] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition shadow-sm select-none uppercase tracking-wider font-mono"
                  >
                    {loadingPlan === p.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    <span>{loadingPlan === p.id ? "Processing checkout..." : `Adopt ${p.id}`}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
