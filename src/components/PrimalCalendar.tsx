import React, { useState } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  MapPin, 
  Clock, 
  Tag, 
  FileText,
  Trash2,
  Send,
  Eye,
  Info,
  ExternalLink
} from "lucide-react";
import { Post, Platform } from "../types";

interface PrimalCalendarProps {
  posts: Post[];
  onReschedulePost: (postId: string, newDate: string) => void;
  onRunPostNow: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onTriggerTab: (tab: string) => void;
}

export default function PrimalCalendar({
  posts,
  onReschedulePost,
  onRunPostNow,
  onDeletePost,
  onTriggerTab
}: PrimalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  
  // High fidelity calendar filters
  const [filterPlatform, setFilterPlatform] = useState<Platform | "ALL">("ALL");

  // Format platform badge color utilities
  const getPlatformChipColor = (platform: Platform) => {
    switch (platform) {
      case "INSTAGRAM": return "bg-pink-50 border-pink-100 text-pink-750 hover:bg-pink-100/50";
      case "TWITTER": return "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100";
      case "LINKEDIN": return "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100";
      case "YOUTUBE": return "bg-red-50 border-red-100 text-red-750 hover:bg-red-100";
      case "FACEBOOK": return "bg-indigo-50 border-indigo-100 text-indigo-800 hover:bg-indigo-100";
    }
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDay }, (_, i) => null);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Filter posts based on timeline specs
  const filteredPosts = posts.filter((post) => {
    if (filterPlatform !== "ALL" && !post.platforms.includes(filterPlatform)) return false;
    return true;
  });

  // Get posts belonging to a specific calendar day number
  const getPostsForDay = (day: number) => {
    return filteredPosts.filter((post) => {
      if (!post.scheduledAt && !post.publishedAt) return false;
      const targetDate = new Date(post.scheduledAt || post.publishedAt!);
      return (
        targetDate.getDate() === day &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div id="primal-calendar-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-slate-700 items-start">
      
      {/* LEFT ASPECT: THE CONTENT CALENDAR MONTH MATRIX (Col-span 8) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
        
        {/* Calendar Nav / Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          <div className="flex items-center gap-4 text-left">
            <h2 className="text-base font-bold font-display text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-200">
              <button 
                onClick={prevMonth}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1 text-[10px] font-mono hover:bg-slate-200 hover:text-slate-900 text-slate-500 rounded-md cursor-pointer transition-colors"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter elements block selection dropdown */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl pr-3 shadow-inner">
              <span className="p-1.5 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                value={filterPlatform}
                onChange={(e: any) => setFilterPlatform(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none font-mono font-bold uppercase select-none cursor-pointer border-none focus:ring-0"
              >
                <option value="ALL">All Platforms</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="TWITTER">Twitter/X</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="FACEBOOK">Facebook</option>
              </select>
            </div>

            <button
              onClick={() => onTriggerTab("compose")}
              className="px-4 py-2 bg-[#f25b24] hover:bg-[#d64a18] text-white text-xs font-bold font-display rounded-xl tracking-wider select-none cursor-pointer transition-colors shadow-sm"
            >
              Compose Date
            </button>
          </div>

        </div>

        {/* Days Header Row */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10.5px] text-slate-400 font-bold border-b border-slate-100 pb-2">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* The Grid Array Calendar Cells representation */}
        <div className="grid grid-cols-7 gap-1 bg-slate-50/50 p-0.5 rounded-xl border border-slate-100">
          {paddingArray.map((_, index) => (
            <div key={`pad-${index}`} className="aspect-[1.2] bg-slate-50/30 text-slate-305"></div>
          ))}

          {daysArray.map((day) => {
            const hasToday = 
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            const dayPosts = getPostsForDay(day);

            return (
              <div 
                key={day}
                className={`aspect-[1.2] bg-white border border-slate-100 p-2 text-left flex flex-col gap-1 overflow-hidden transition-all hover:bg-slate-50 cursor-pointer rounded-lg ${hasToday ? "border-[#f25b24] ring-1 ring-[#f25b24]/20 bg-orange-50/20" : ""}`}
                onClick={() => {
                  if (dayPosts.length > 0) {
                    setSelectedPost(dayPosts[0]);
                  }
                }}
              >
                <span className={`text-[10px] font-mono leading-none ${hasToday ? "text-[#f25b24] font-extrabold" : "text-slate-400"}`}>
                  {day}
                </span>

                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      className={`px-1.5 py-1 text-[8.5px] font-mono font-bold leading-none truncate border rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 shadow-sm ${getPlatformChipColor(post.platforms[0])} ${post.status === "PUBLISHED" ? "opacity-70" : ""}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current shrink-0"></span>
                      <span>{post.title || "Untitled"}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT DRAWER: ACTIVE SELECTED POST DETAILS DETAIL (Col-span 4) */}
      <div className="lg:col-span-4">
        {selectedPost ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-5 animate-fade-in shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Inspect Node</span>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-xs text-slate-400 hover:text-slate-900 font-mono font-bold cursor-pointer transition-colors"
              >
                Close ×
              </button>
            </div>

            {/* Platform indicators */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedPost.platforms.map((plat) => (
                <span 
                  key={plat}
                  className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[8.5px] font-extrabold font-mono text-slate-700 tracking-wider"
                >
                  {plat}
                </span>
              ))}

              <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold leading-none border ${
                selectedPost.status === "PUBLISHED" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                selectedPost.status === "SCHEDULED" ? "bg-sky-50 border-sky-100 text-sky-700" :
                "bg-slate-55 border-slate-22 text-slate-500"
              }`}>
                {selectedPost.status}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800 leading-tight">{selectedPost.title}</h3>
              <p className="text-[10px] text-slate-405 text-slate-400 font-mono">
                {selectedPost.scheduledAt ? `Target: ${new Date(selectedPost.scheduledAt).toLocaleString()}` : "No time allocated"}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3.5 border border-slate-200">
              <p className="text-[11px] leading-relaxed text-slate-600 italic">
                "{selectedPost.caption}"
              </p>

              {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 && (
                <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video shadow-sm">
                  <img 
                    src={selectedPost.mediaUrls[0]} 
                    alt="inspected file"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>

            {selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedPost.tags.map((tg, i) => (
                  <span key={i} className="text-[10px] font-mono text-[#f25b24] font-semibold">#{tg}</span>
                ))}
              </div>
            )}

            {/* Action items buttons */}
            <div className="pt-2 border-t border-slate-105 space-y-2">
              {selectedPost.status !== "PUBLISHED" && (
                <button
                  type="button"
                  onClick={() => {
                    onRunPostNow(selectedPost.id);
                    onTriggerTab("calendar");
                  }}
                  className="w-full py-2.5 bg-[#f25b24] hover:bg-[#d64a18] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 select-none cursor-pointer transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute Automation Live</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onDeletePost(selectedPost.id);
                  setSelectedPost(null);
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-605 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Clan Post</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 border-dashed space-y-3.5 py-12 shadow-sm">
            <Info className="w-8 h-8 mx-auto text-slate-350 text-slate-300" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Primal Inspector Panel</h4>
              <p className="text-[10px]/normal text-slate-455 text-slate-400">
                Click any colored calendar card to inspect connected asset configurations, tags, images, or log workflows!
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
