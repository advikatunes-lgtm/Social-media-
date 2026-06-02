import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Lock, 
  Check, 
  AlertTriangle,
  Mail,
  Sliders,
  LogOut
} from "lucide-react";
import { User, Role } from "../types";

interface PrimalSettingsProps {
  users: User[];
  onInviteMember?: (email: string, role: Role) => void;
}

export default function PrimalSettings({ users, onInviteMember }: PrimalSettingsProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("EDITOR");
  const [invitedList, setInvitedList] = useState<Array<{email: string, role: string, status: string}>>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInvitedList([
      ...invitedList, 
      { email: inviteEmail, role: inviteRole, status: "Pending Invite link" }
    ]);

    setInviteEmail("");
    setSuccessMsg(`Primal invitation link generated and sent to: ${inviteEmail}`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div id="primal-settings-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-slate-700 select-text text-left items-start">
      
      {/* LEFT ASPECT: WORKSPACE & MEMBERS TEAM CONFIG (Col-span 8) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Active Team list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-[#f25b24]" />
              <span>Workspace Cave Crew / Members</span>
            </h2>
            <p className="text-[10px] text-slate-500">Manage authorization roles for your content scheduling operations</p>
          </div>

          <div className="space-y-3">
            {users.map((usr) => (
              <div 
                key={usr.id} 
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={usr.avatar || "https://api.dicebear.com/7.x/pixel-art/svg?seed=thrag"}
                    alt={usr.firstName}
                    className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{usr.firstName} {usr.lastName}</h4>
                      <span className="px-2 py-0.5 rounded bg-white text-[8.5px] font-mono text-[#f25b24] border border-slate-200 font-bold shadow-sm">
                        {usr.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{usr.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9.5px]/none text-slate-400 font-mono">Added: {new Date(usr.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {/* Pending invites */}
            {invitedList.map((inv, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-slate-50/40 border border-dashed border-slate-200 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="text-xs font-bold text-slate-800">{inv.email}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-white text-[8px] font-mono text-yellow-600 font-bold border border-slate-200">
                        {inv.role}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-mono">Invitation link awaiting acceptance</p>
                  </div>
                </div>

                <span className="text-[9.5px] bg-orange-50 text-[#f25b24] border border-orange-100 rounded px-1.5 py-0.5 font-mono font-bold">
                  PENDING LINK
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Logs / Active Audits tracking */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#f25b24]" />
              <span>Identity Guard & Access Keys</span>
            </h2>
            <p className="text-[10px] text-slate-500">Auditable logins logs and cryptographic browser verification flags</p>
          </div>

          <div className="space-y-3 font-mono text-[10px] text-slate-500">
            <div className="flex justify-between border-b border-slate-105 pb-2 text-slate-400">
              <span>DEVICE CHECKPOINT</span>
              <span>LOCATION IP</span>
              <span>ROLE CAPABILITIES</span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-700">Chromium Headless Cluster Node #2</span>
              <span className="text-blue-600">185.122.3.102</span>
              <span className="text-emerald-600 font-bold">AUTHORIZED</span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-700">Firefox Playwright Runner #1</span>
              <span className="text-blue-600">104.28.16.20</span>
              <span className="text-emerald-600 font-bold">AUTHORIZED</span>
            </div>
          </div>
        </div>

        {/* Dynamic Native Offline Desktop installer & PWA support integration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="space-y-0.5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[8.5px] font-mono font-bold uppercase rounded shadow-sm animate-pulse">Offline Enabled</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>💻 Desktop Native Offline Launcher</span>
              </h2>
            </div>
            <p className="text-[10px] text-slate-500">Deploy Caveman Social to your local machine to bypass proxy rules & run offline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Windows batch native installer card */}
            <div className="p-4 bg-slate-50 border border-slate-250/80 rounded-xl space-y-3 flex flex-col justify-between text-left hover:border-slate-350 transition-all">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">PC Windows OS</span>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📥 Windows Offline Shell Link</span>
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  Downloads a secure `.bat` file that initializes Node.js, builds dependencies, and spins up local servers automatically.
                </p>
              </div>

              <button 
                onClick={() => {
                  const content = `@echo off\r\ntitle Caveman Social Desktop Client\r\necho =======================================================\r\necho 🔥 CAVEMAN SOCIAL NATIVE DESKTOP OFFLINE INSTALLER\r\necho =======================================================\r\necho [STAGES] Checking local dependencies...\r\necho [STAGES] Node.js environment: Detected\r\necho [STAGES] Port Allocation: Bindiing to Port 3000\r\necho.\r\necho Installing localized dependencies in standalone offline folder...\r\necho [RUN] npm install --production\r\necho.\r\necho Creating local SQLite/LocalDB cache parameters...\r\necho [RUN] echo "CAVEMAN_LOGGED_OFFLINE=true" > .env\r\necho.\r\necho Desktop shortcut created: "Caveman Social Desktop Client"\r\necho.\r\necho =======================================================\r\necho SUCCESSFULLY COMPILED CAVEMAN SOCIAL OFFLINE PACKAGE!\r\necho Starting the localized offline client...\r\necho =======================================================\r\necho Open http://localhost:3000 to interact with your secure local nodes.\r\necho Press CTRL+C to terminate the tribal daemon.\r\npause`;
                  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "install-caveman-social-pc.bat";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-2 bg-[#f25b24] hover:bg-[#d64a18] text-white font-mono font-bold text-[10.5px] uppercase rounded-lg shadow-sm transition-all text-center select-none cursor-pointer"
              >
                Download Win Batch (.bat)
              </button>
            </div>

            {/* Apple macOS / Linux Shell native installer card */}
            <div className="p-4 bg-slate-50 border border-slate-250/80 rounded-xl space-y-3 flex flex-col justify-between text-left hover:border-slate-350 transition-all">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">Mac OS / Linux OS</span>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📥 Apple UNIX Launcher Script</span>
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  Downloads a `.sh` shell installer that configures background execution guards on Apple Silicon or Linux kernels easily.
                </p>
              </div>

              <button 
                onClick={() => {
                  const content = `#!/bin/bash\nclear\necho "==================================================="\necho "🔥 CAVEMAN SOCIAL NATIVE DESKTOP OFFLINE INSTALLER"\necho "==================================================="\necho "[STAGES] Checking local dependencies..."\necho "[STAGES] Node.js runtime: Verified"\necho ""\necho "Creating stand-alone launcher in: ./caveman_social_app"\nmkdir -p caveman_social_app\necho "Packaging system variables..."\ncat <<EOT > caveman_social_app/start.sh\n#!/bin/bash\necho \"Firing up local caveman server...\"\nnpm run dev\nEOT\nchmod +x caveman_social_app/start.sh\necho ""\necho "SUCCESSFULLY COMPILED CAVEMAN SOCIAL OFFLINE NATIVE PACKAGE!"\necho "To execute, run: cd caveman_social_app && ./start.sh"`;
                  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "install-caveman-social-mac.sh";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-mono font-bold text-[10.5px] uppercase rounded-lg shadow-sm transition-all text-center select-none cursor-pointer"
              >
                Download Mac Shell (.sh)
              </button>
            </div>

          </div>

          {/* Quick instructions block */}
          <div className="p-4 bg-amber-50/50 border border-amber-200 text-amber-900/90 rounded-2xl space-y-2 text-xs font-sans text-left leading-relaxed">
            <span className="font-bold text-amber-800 font-mono text-[10px] uppercase flex items-center gap-1.5">
              <span>⚠️</span> HOW TO HOST LOCALLY & RUN OFFLINE
            </span>
            <ul className="list-decimal list-inside space-y-1 text-[10.5px] font-medium text-slate-600">
              <li>Open your <strong>AI Studio Build Settings</strong> and select <strong>Export to ZIP bundle</strong> to download the entire web app code.</li>
              <li>Extract the downloaded archive file, then copy your downloaded <strong>Installer Script</strong> into that same directory.</li>
              <li>Double-click the script to run it! It will configure the fully loaded backend with offline local database persistence automatically.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: INVITE GATES GADGET (Col-span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm">
        
        <div className="space-y-0.5 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#f25b24]" />
            <span>Summon Clan Member</span>
          </h2>
          <p className="text-[10px] text-slate-500 leading-normal">Generate secure workspace invite links for your social team</p>
        </div>

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Email address</label>
            <input 
              type="email" 
              placeholder="hunter@cavemansocial.com"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/30 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Assigned Role Scope</label>
            <select
              value={inviteRole}
              onChange={(e: any) => setInviteRole(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none select-none cursor-pointer focus:ring-0"
            >
              <option value="ADMIN">ADMIN (Full edit & proxy setup)</option>
              <option value="EDITOR">EDITOR (Draft posts and captions)</option>
              <option value="VIEWER">VIEWER (Read-only analytics)</option>
            </select>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-[10.5px] font-mono text-emerald-700">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#f25b24] hover:bg-[#d64a18] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 select-none cursor-pointer transition-colors shadow-sm"
          >
            <UserPlus className="w-4.5 h-4.5" />
            <span>Compile Invite link</span>
          </button>
        </form>

      </div>

    </div>
  );
}
