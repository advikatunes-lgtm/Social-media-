import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Calendar, 
  Paperclip, 
  CornerDownRight, 
  Type, 
  Info, 
  Grid,
  Image,
  RefreshCw,
  Clock,
  Eye
} from "lucide-react";
import { Platform } from "../types";

interface PrimalComposerProps {
  onSavePost: (postData: any) => Promise<any>;
  onTriggerTab: (tab: string) => void;
  mediaFiles: any[];
}

export default function PrimalComposer({ onSavePost, onTriggerTab, mediaFiles }: PrimalComposerProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["TWITTER"]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  // AI assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiVibe, setAiVibe] = useState<"fire" | "oongaboonga" | "wisdom" | "brutal">("oongaboonga");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Dynamic user media uploading states
  const [customUrl, setCustomUrl] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [localMediaFiles, setLocalMediaFiles] = useState<any[]>([]);

  // Active platform limit checker checks
  const getCharLimit = (platforms: Platform[]) => {
    if (platforms.includes("TWITTER")) return 280;
    if (platforms.includes("INSTAGRAM")) return 2200;
    return 5000;
  };

  const currentLimit = getCharLimit(selectedPlatforms);
  const excessChars = caption.length - currentLimit;

  // Handles adding tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSelectPlatform = (plat: Platform) => {
    if (selectedPlatforms.includes(plat)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== plat));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, plat]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result as string;
        try {
          const response = await fetch("/api/workspaces/ws_1/media/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              originalName: file.name,
              mimeType: file.type,
              size: file.size,
              url: base64Url,
              tags: ["user-upload"]
            })
          });

          if (response.ok) {
            const newFile = await response.json();
            setLocalMediaFiles((prev) => [newFile, ...prev]);
            setSelectedMedia((prev) => [...prev, newFile.url]);
          }
        } catch (apiErr) {
          console.error("Failed uploading to backend media API:", apiErr);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed reading file input:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddCustomUrl = async () => {
    if (!customUrl.trim()) return;
    const url = customUrl.trim();
    try {
      const response = await fetch("/api/workspaces/ws_1/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: url.split("/").pop() || "custom_url_image.jpg",
          originalName: "custom_url_image.jpg",
          mimeType: "image/jpeg",
          size: 9999,
          url: url,
          tags: ["custom-url"]
        })
      });

      if (response.ok) {
        const newFile = await response.json();
        setLocalMediaFiles((prev) => [newFile, ...prev]);
        setSelectedMedia((prev) => [...prev, newFile.url]);
        setCustomUrl("");
      } else {
        const fallbackFile = {
          id: "fallback_" + Math.random().toString(36).substr(2, 9),
          url: url
        };
        setLocalMediaFiles((prev) => [fallbackFile, ...prev]);
        setSelectedMedia((prev) => [...prev, url]);
        setCustomUrl("");
      }
    } catch (e) {
      console.error(e);
      const fallbackFile = {
        id: "fallback_" + Math.random().toString(36).substr(2, 9),
        url: url
      };
      setLocalMediaFiles((prev) => [fallbackFile, ...prev]);
      setSelectedMedia((prev) => [...prev, url]);
      setCustomUrl("");
    }
  };

  const allMediaFiles = [...mediaFiles, ...localMediaFiles];

  // Contacts the real server-side Gemini endpoint!
  const generateAICaption = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          vibe: aiVibe,
          platform: selectedPlatforms[0] || "general"
        })
      });

      if (!response.ok) {
        throw new Error("Shaman spirit failed to deliver prompt response.");
      }

      const resData = await response.json();
      if (resData.result) {
        setCaption(resData.result);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Primal AI gateway error.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (publishImmediately: boolean) => {
    if (!caption.trim()) return;

    const payload = {
      title: title || "Ignited Post",
      caption,
      platforms: selectedPlatforms,
      mediaUrls: selectedMedia,
      scheduledAt: publishImmediately ? undefined : (scheduledAt || undefined),
      tags,
      isRecurring: false
    };

    const saved = await onSavePost(payload);
    
    // Clear fields on success
    setTitle("");
    setCaption("");
    setSelectedMedia([]);
    setTags([]);
    setScheduledAt("");

    if (publishImmediately) {
      // Direct user to dashboard list so they see the logs execute!
      onTriggerTab("dashboard");
    } else {
      onTriggerTab("calendar");
    }
  };

  const getPlatformClass = (plat: Platform) => {
    const isSelected = selectedPlatforms.includes(plat);
    switch (plat) {
      case "INSTAGRAM": 
        return isSelected 
          ? "bg-gradient-to-tr from-pink-500 to-indigo-600 text-white border-pink-500 font-bold" 
          : "bg-slate-50 text-pink-600 border-slate-200 hover:bg-slate-100/80";
      case "TWITTER": 
        return isSelected 
          ? "bg-slate-900 text-white border-slate-900 font-bold" 
          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100/80";
      case "LINKEDIN": 
        return isSelected 
          ? "bg-blue-600 text-white border-blue-500 font-bold" 
          : "bg-slate-50 text-blue-600 border-slate-200 hover:bg-slate-100/80";
      case "YOUTUBE": 
        return isSelected 
          ? "bg-red-650 text-white border-red-500 font-bold" 
          : "bg-slate-50 text-red-650 border-slate-200 hover:bg-slate-100/80";
      case "FACEBOOK": 
        return isSelected 
          ? "bg-blue-800 text-white border-blue-700 font-bold" 
          : "bg-slate-50 text-blue-705 border-slate-205 hover:bg-slate-100/80";
    }
  };

  return (
    <div id="primal-composer-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-slate-700 items-start">
      
      {/* LEFT COLUMN: EDITOR PANEL SUITE */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Platform Picker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3.5 shadow-sm text-left">
          <div className="space-y-0.5">
            <h3 className="text-xs text-slate-400 font-mono tracking-wider uppercase font-bold">Target Channels</h3>
            <p className="text-[10px] text-slate-505 text-slate-500 leading-none">Select one or more active browser profiles</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(["TWITTER", "INSTAGRAM", "LINKEDIN", "YOUTUBE", "FACEBOOK"] as Platform[]).map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => handleSelectPlatform(plat)}
                className={`px-4 py-2 text-[10.5px] rounded-xl border transition-all cursor-pointer select-none ${getPlatformClass(plat)}`}
              >
                {plat === "TWITTER" ? "Twitter / X" : plat.charAt(0) + plat.substring(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Caption and Title Inputs Container Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Post Details</span>
            <input 
              type="text"
              placeholder="Campaign tag title... (e.g. Bronto ribs promo)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
            />
          </div>

          <div className="relative text-left space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Post text</span>
            <textarea
              placeholder="Carve your message onto social networks..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={5}
              className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/40 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors resize-y leading-relaxed font-sans"
            />

            <div className="flex items-center justify-between text-[10px] font-mono mt-1 px-1">
              <span className="text-slate-400">Character limit constraint checks</span>
              <span className={excessChars > 0 ? "text-rose-600 font-bold" : "text-slate-500 border-b border-dashed border-slate-200 pb-0.5"}>
                {caption.length} / {currentLimit} chars {excessChars > 0 && `(Excess: ${excessChars}!)`}
              </span>
            </div>
          </div>

          {/* Quick upload selected attachment simulator list with drag and drop manual fallback */}
          <div className="space-y-3.5 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Attach Media to Post</span>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Left Side: Drag-and-drop and Custom URL uploader */}
              <div className="md:col-span-5 space-y-3">
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      await handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById("hidden-file-input")?.click()}
                  className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 min-h-[110px] select-none ${
                    isDragActive 
                      ? "border-[#f25b24] bg-[#f25b24]/5" 
                      : "border-slate-200 hover:border-[#f25b24]/30 hover:bg-slate-50/50"
                  }`}
                >
                  <input 
                    type="file" 
                    id="hidden-file-input" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        await handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 text-[#f25b24] animate-spin" />
                      <span className="text-[10px] font-mono text-slate-500 font-bold">Uploading to clan...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🏔️</span>
                      <div className="leading-tight">
                        <span className="text-[10.5px] font-bold text-slate-705 block">Click or Drop Image</span>
                        <span className="text-[9px] text-slate-400 font-mono">PNG, JPG, WEBP bounds</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Custom Image URL entry fallback */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Or paste media URL..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && customUrl.trim()) {
                        e.preventDefault();
                        await handleAddCustomUrl();
                      }
                    }}
                    className="flex-1 bg-white border border-slate-200 focus:border-[#f25b24]/30 text-[10px] px-3 py-1.5 rounded-lg outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    disabled={!customUrl}
                    className="px-2.5 py-1 text-[9.5px] font-mono font-bold bg-[#f25b24] text-white rounded-lg cursor-pointer disabled:bg-slate-100 disabled:text-slate-350 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Right Side: Available Library Items Grid */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 h-full overflow-y-auto max-h-[145px] max-w-full">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block mb-2 text-left">Available Clan Assets</span>
                  <div className="grid grid-cols-4 gap-2">
                    {allMediaFiles.map((med) => {
                      const isSelected = selectedMedia.includes(med.url);
                      return (
                        <div 
                          key={med.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMedia(selectedMedia.filter((url) => url !== med.url));
                            } else {
                              setSelectedMedia([...selectedMedia, med.url]);
                            }
                          }}
                          className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border hover:scale-[1.03] transition-all bg-white ${
                            isSelected 
                              ? "border-[#f25b24] ring-1 ring-[#f25b24]/20" 
                              : "border-slate-200"
                          }`}
                        >
                          <img 
                            src={med.url} 
                            alt="attachment selection" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#f25b24]/25 flex items-center justify-center">
                              <span className="px-1.5 py-0.5 bg-[#f25b24] text-[7.5px] font-mono font-black text-white uppercase rounded shadow-sm">Attached</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {allMediaFiles.length === 0 && (
                      <span className="col-span-4 text-center py-6 text-slate-400 text-[10px] font-mono uppercase">Grid empty</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Tags list items additions */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Tribe Tags / Categories</span>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-mono text-slate-700 font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span>#{tag}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(idx)} 
                    className="text-slate-400 hover:text-slate-900 font-bold inline-block leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input 
                type="text"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-transparent text-xs outline-none text-slate-800 border-none focus:ring-0 min-w-[150px] placeholder:text-slate-400"
              />
            </div>
          </div>

        </div>
        {/* AI CAPTION ASSISTANT CARD SUITE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden text-left space-y-4 shadow-sm">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#f25b24]/5 rounded-full blur-[40px] pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-xs text-slate-900 uppercase tracking-wider font-semibold font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#f25b24] animate-pulse" />
                <span>Primal Shaman Caption Synthesizer</span>
              </h3>
              <p className="text-[9.5px] text-slate-400">Contact the server-side Gemini system to ignite copy</p>
            </div>
            <span className="text-[8px] px-2 py-0.5 bg-[#f25b24]/10 border border-[#f25b24]/20 rounded text-[#f25b24] font-mono font-bold">
              GEMINI-3.5-FLASH
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Give a modern seed theme (e.g. Ribs BBQ and discount spears promotion...)"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 focus:border-[#f25b24]/30 rounded-xl px-4 py-2.5 text-xs outline-none placeholder-slate-400"
              />
              <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <select
                  value={aiVibe}
                  onChange={(e: any) => setAiVibe(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-700 px-3 outline-none border-none focus:ring-0 select-none"
                >
                  <option value="oongaboonga">🐗 Oonga Boonga Grunts</option>
                  <option value="wisdom">🧘 Shamanic Wisdom</option>
                  <option value="brutal">🔨 Brutalist Grunts</option>
                  <option value="fire">🚀 Fire Agency Energy</option>
                </select>
                <button
                  type="button"
                  onClick={generateAICaption}
                  disabled={aiLoading}
                  className="px-4 bg-[#f25b24] hover:bg-[#d64a18] disabled:bg-slate-100 disabled:text-slate-450 text-white text-xs font-bold font-mono transition-colors border-l border-[#f25b24] cursor-pointer"
                >
                  {aiLoading ? "Igniting..." : "Ignite"}
                </button>
              </div>
            </div>

            {aiError && (
              <p className="text-[9.5px] font-mono text-rose-600">🔥 Primal Alert: {aiError}</p>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: PREVIEW PANEL SYSTEM & ACTIONS */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* ACTION SCHEDULER PANEL CART */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#f25b24]" />
              <span>Job Dispatcher</span>
            </h3>
            <p className="text-[10px] text-slate-500">Enforce date/time triggers</p>
          </div>

          <div className="space-y-1 text-left">
            <span className="text-[9.5px] text-slate-400 font-mono block">SELECT DATE & TIME</span>
            <div className="relative">
              <input 
                type="datetime-local" 
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#f25b24]/30 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none select-text"
              />
            </div>
            <p className="text-[9px] text-slate-500 leading-normal mt-1 leading-relaxed">
              Leave empty to immediately save as a Draft or manually execute a simulation on the active posts pipeline tab!
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => handleSubmit(true)}
              className="w-full py-3 bg-[#f25b24] hover:bg-[#d64a18] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 select-none cursor-pointer transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ignite Now (Simulate Run)</span>
            </button>

            <button
              disabled={!scheduledAt}
              onClick={() => handleSubmit(false)}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100/95 border border-slate-200 disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300 text-[#f25b24] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Buffer Schedule Task</span>
            </button>
          </div>
        </div>

        {/* FEED PREVIEW MOCKUP RENDER BOX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#f25b24]" />
                <span>Live Feed Preview</span>
              </h3>
              <p className="text-[10px] text-slate-500">How Neanderthals see your posts</p>
            </div>
            
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              {selectedPlatforms[0] || "PREVIEW"}
            </span>
          </div>

          {/* Simulated phone frame container */}
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl space-y-3 shadow-inner max-h-[320px] overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-2">
              <div className="w-7 h-7 rounded-full bg-[#f25b24] text-[10px] text-white font-bold flex items-center justify-center select-none shadow-sm">
                🍖
              </div>
              <div className="text-left leading-none">
                <h5 className="text-[10.5px] font-bold text-slate-900">Primal Clan Feed</h5>
                <span className="text-[8.5px] text-slate-400 font-mono">1 minute ago</span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed select-none break-words text-slate-705 text-slate-700 font-sans">
              {caption || "No content carved. Set caption text..."}
            </p>

            {selectedMedia.map((url, index) => (
              <div key={index} className="rounded-lg overflow-hidden border border-slate-200 ratio aspect-video">
                <img 
                  src={url} 
                  alt="preview image" 
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}

            {selectedMedia.length === 0 && (
              <div className="aspect-video rounded-lg bg-white border border-slate-150 flex flex-col items-center justify-center text-slate-400 gap-1 select-none text-center">
                <Image className="w-6 h-6 text-slate-300" />
                <span className="text-[9.5px] font-mono font-bold uppercase text-slate-400">No graphic attachments</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
