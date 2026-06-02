import React, { useEffect, useState, useRef } from "react";
import { Terminal, ShieldAlert, CheckCircle, RefreshCw, X } from "lucide-react";

interface PrimalTerminalProps {
  streamId: string;
  title: string;
  onClose: () => void;
  isRunningByDefault?: boolean;
}

export default function PrimalTerminal({ streamId, title, onClose, isRunningByDefault = true }: PrimalTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("running");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs(["[SYSTEM] Initializing stream link connection...", `[SYSTEM] Stream ID assigned: ${streamId}`]);

    const eventSource = new EventSource(`/api/terminal/stream/${streamId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.log) {
          const logLine = data.log;
          setLogs((prev) => [...prev, logLine]);

          if (logLine.includes("[PLAYWRIGHT_COMPLETED]") || logLine.includes("[VERIFICATION_COMPLETED]")) {
            setStatus("completed");
            eventSource.close();
          } else if (logLine.includes("[PLAYWRIGHT_FAILED]") || logLine.includes("[VERIFICATION_FAILED]")) {
            setStatus("failed");
            eventSource.close();
          }
        }
      } catch (err) {
        console.error("Failed to parse event data:", err);
      }
    };

    eventSource.onerror = () => {
      console.warn("SSE connection error, closing streams.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [streamId]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="playwright-terminal-panel"
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-550 bg-rose-500 animate-pulse"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-605 text-slate-500 border-l border-slate-200 pl-3">
              <Terminal className="w-3.5 h-3.5 text-[#f25b24]" />
              <span className="font-bold">{title}</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 px-1.5 hover:bg-slate-200 hover:text-slate-900 text-slate-400 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console logs box */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-orange-500 bg-slate-950 rounded-inner">
          {logs.map((log, index) => {
            let color = "text-slate-300";
            if (log.includes("[SYSTEM]")) color = "text-cyan-400 font-semibold";
            else if (log.includes("[PLAYWRIGHT]")) color = "text-[#f25b24] font-medium";
            else if (log.includes("[VERIFICATION]")) color = "text-yellow-400 font-medium";
            else if (log.includes("SUCCESS!") || log.includes("COMPLETED")) color = "text-emerald-400 font-bold";
            else if (log.includes("FAILED") || log.includes("[CRITICAL") || log.includes("[ERROR]")) color = "text-rose-455 text-rose-400 font-bold";
            else if (log.includes("──")) color = "text-slate-500 font-semibold";

            // Hide raw socket command flags from display
            if (log.includes("[PLAYWRIGHT_COMPLETED]") || log.includes("[VERIFICATION_COMPLETED]")) return null;

            return (
              <div key={index} className={`${color} break-all whitespace-pre-wrap text-left`}>
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Footer actions / Indicators */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            {status === "running" && (
              <span className="flex items-center gap-1.5 text-yellow-600 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-600" />
                <span>Executing Browser Threads...</span>
              </span>
            )}
            {status === "completed" && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Successfully Ended</span>
              </span>
            )}
            {status === "failed" && (
              <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Execution Terminated</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={status === "running"}
            className="px-4 py-2 bg-[#f25b24] hover:bg-[#d64a18] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold font-mono tracking-wider text-[10px] select-none cursor-pointer transition-all uppercase"
          >
            {status === "running" ? "Running task" : "Close Console"}
          </button>
        </div>
      </div>
    </div>
  );
}
