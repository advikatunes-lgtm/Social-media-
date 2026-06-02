import React, { useEffect, useState } from "react";
import { 
  Layers, 
  Clock, 
  CheckCircle2, 
  XSquare, 
  Play, 
  Pause, 
  RefreshCw, 
  Search,
  Terminal,
  Activity,
  Trash2
} from "lucide-react";
import { ScheduledJob } from "../types";

interface PrimalQueueProps {
  onTriggerTab: (tab: string) => void;
  onRunPostNow: (postId: string) => void;
  onCancelPost: (postId: string) => void;
}

export default function PrimalQueue({ onTriggerTab, onRunPostNow, onCancelPost }: PrimalQueueProps) {
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQueueData = async () => {
    try {
      const response = await fetch("/api/workspaces/ws_1/queue");
      if (response.ok) {
        const data = await response.json();
        setActiveJobs(data);
      }
    } catch (err) {
      console.error("Queue loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 8000); // Poll for automated updates
    return () => clearInterval(interval);
  }, []);

  const handleRunImmediately = async (postId: string) => {
    await onRunPostNow(postId);
    onTriggerTab("queue");
  };

  const filteredJobs = activeJobs.filter((job) => 
    job.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.postId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="primal-queue-root" className="space-y-6 animate-fade-in text-slate-600 select-text text-left">
      
      {/* Queues Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#f25b24]" />
            <span>BullMQ Redis Queue Manager</span>
          </h2>
          <p className="text-[10px] text-slate-500 leading-normal">
            Monitor delayed queues, concurrency pools, active workers, and scheduled browser runners in solid real-time
          </p>
        </div>

        <button 
          onClick={fetchQueueData}
          className="p-1 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 text-[11.5px] text-slate-600 font-mono font-bold cursor-pointer transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Synchronize Redis</span>
        </button>
      </div>

      {/* CORE QUEUE NUMBERS STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[9px] font-mono text-slate-400 uppercase font-bold text-left block">Active Workers</span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-base font-bold text-slate-800 font-mono">4 Instances</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[9px] font-mono text-slate-400 uppercase font-bold text-left block">Jobs Delayed Buffer</span>
          <span className="text-base font-bold text-slate-800 font-mono">{activeJobs.filter((j) => j.status === "delayed").length} Delayed</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[9px] font-mono text-slate-400 uppercase font-bold text-left block">Completed Jobs Today</span>
          <span className="text-base font-bold text-slate-800 font-mono">14 Succeeded</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 relative overflow-hidden shadow-sm">
          <span className="text-[9px] font-mono text-amber-600 uppercase font-bold text-left block">Redis Pulse</span>
          <div className="flex items-center gap-1 font-mono text-xs text-slate-850 font-bold pt-0.5">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Connected [0.6ms latency]</span>
          </div>
        </div>

      </div>

      {/* FILTER SEARCH FIELD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 px-3 bg-slate-50 border border-slate-200 focus-within:border-[#f25b24]/30 rounded-xl shadow-inner">
          <Search className="w-4 h-4 text-slate-450 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search queued job IDs, payloads, target tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-805 outline-none py-3"
          />
        </div>

        {/* QUEUED SCHEDULERS DETAILED DATA */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-[#f25b24] mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading Redis database schemas...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
            <Clock className="w-8 h-8 text-slate-300" />
            <p>No active queued jobs in delayed queue heap.</p>
            <button 
              onClick={() => onTriggerTab("compose")}
              className="font-bold text-[#f25b24] underline cursor-pointer"
            >
              Configure schedule trigger now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 pb-2">
                  <th className="pb-3 uppercase tracking-wider font-semibold">JOB ID</th>
                  <th className="pb-3 uppercase tracking-wider font-semibold">TARGET TIME</th>
                  <th className="pb-3 uppercase tracking-wider font-semibold">CAMPAIGN / POST</th>
                  <th className="pb-3 uppercase tracking-wider font-semibold">PLATFORMS</th>
                  <th className="pb-3 uppercase tracking-wider font-semibold">ATTEMPTS COGNIZANCE</th>
                  <th className="pb-3 uppercase tracking-wider font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-800 uppercase tracking-wider">
                      {job.bullJobId || job.id}
                    </td>
                    <td className="py-4 text-slate-600">
                      {new Date(job.scheduledAt).toLocaleString()}
                    </td>
                    <td className="py-4 font-sans text-xs">
                      <div>
                        <span className="font-bold text-slate-705 block">{job.postTitle}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 italic">"{job.postCaption}"</span>
                      </div>
                    </td>
                    <td className="py-4 flex gap-1 items-center mt-2.5">
                      {job.postPlatforms.map((plat: string) => (
                        <span key={plat} className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-205 text-[8px] font-bold text-[#f25b24]">
                          {plat}
                        </span>
                      ))}
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 font-bold">
                        {job.attempts} / 3 Attempts
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunImmediately(job.postId)}
                          className="px-2.5 py-1 bg-[#f25b24]/10 text-[#f25b24] border border-[#f25b24]/10 rounded hover:bg-[#f25b24] hover:text-white transition-all text-[9.5px] font-bold cursor-pointer"
                          title="Execute Playwright bypass immediately"
                        >
                          Trigger Now (Sim)
                        </button>
                        <button
                          onClick={() => onCancelPost(job.postId)}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          title="Pause Scheduling job"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED DIAGNOSTICS HELP BLOCK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 border-dashed space-y-4 shadow-sm">
        <h4 className="text-[11px] font-bold tracking-wider text-slate-700 uppercase font-mono flex items-center gap-1.5 animate-pulse">
          <Terminal className="w-4 h-4 text-[#f25b24]" />
          <span>Automated retry and throttling policies</span>
        </h4>
        <ul className="space-y-1.5 text-[10px] text-slate-500 leading-relaxed list-disc pl-4 text-left font-sans">
          <li><strong>BullMQ Backoff Limit:</strong> Failed posts automatically trigger exponential backoff retry cycles: attempt 1 (2 mins), attempt 2 (10 mins), and attempt 3 (1 hr).</li>
          <li><strong>Rate Limit Shields:</strong> The scheduler maintains an internal delay gap limit of 3 minutes per active profile to prevent platform algorithmic red flags.</li>
          <li><strong>Bypassing challenges:</strong> If headless cookies generate 401 unauthorized errors, the queue delays tasks and triggers user verification notifications.</li>
        </ul>
      </div>

    </div>
  );
}
