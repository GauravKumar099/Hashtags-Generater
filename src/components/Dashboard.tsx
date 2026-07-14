import React, { useState, useEffect } from "react";
import {
  Sparkles, Hash, Type, AlignLeft, Search, Copy, CheckCircle,
  Download, Share2, Star, RefreshCw, AlertTriangle, Play, HelpCircle,
  Clock, Zap, Check, ChevronRight, BarChart2, MessageSquare, Info
} from "lucide-react";
import { UserStats, HashtagData, CaptionData, TitleData, KeywordData, HistoryItem, FavoriteItem } from "../types";
import AdSpace from "./AdSpace";

interface DashboardProps {
  user: UserStats | null;
  setUser: React.Dispatch<React.SetStateAction<UserStats | null>>;
  onLoginClick: () => void;
  favorites: FavoriteItem[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteItem[]>>;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export default function Dashboard({
  user,
  setUser,
  onLoginClick,
  favorites,
  setFavorites,
  history,
  setHistory
}: DashboardProps) {
  // Generator type: 'hashtag' | 'caption' | 'title' | 'keyword'
  const [genType, setGenType] = useState<"hashtag" | "caption" | "title" | "keyword">("hashtag");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [language, setLanguage] = useState("English");
  
  // Hashtag counts: 10, 30, 50
  const [hashtagCount, setHashtagCount] = useState(30);
  
  // Caption style options
  const [captionStyle, setCaptionStyle] = useState("Viral");

  // Loading, success, error, warnings
  const [loading, setLoading] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  
  // Active output data
  const [activeOutput, setActiveOutput] = useState<{
    type: "hashtag" | "caption" | "title" | "keyword";
    topic: string;
    hashtagData?: HashtagData;
    captionData?: CaptionData;
    titleData?: TitleData;
    keywordData?: KeywordData;
  } | null>(null);

  // Suggested / Trending Categories
  const trendingCategories = [
    { label: "Football", value: "Football growth tips & match highlights" },
    { label: "Cricket", value: "T20 cricket match trends & analytics" },
    { label: "Gaming", value: "Minecraft speedrun strategy & setup hacks" },
    { label: "AI", value: "Generative AI tools & automation workflow" },
    { label: "Technology", value: "Smartphone reviews & futuristic gadgets" },
    { label: "Travel", value: "Budget travel itinerary to Switzerland" },
    { label: "Fashion", value: "Minimal summer outfits outfit checklist" },
    { label: "Fitness", value: "Calisthenics workout routines & high protein diets" },
    { label: "Business", value: "SaaS startup bootstrapping secrets in 2026" },
    { label: "Movies", value: "Sci-fi movies recommendations & plot analysis" }
  ];

  // Increment user generation count
  const recordGeneration = () => {
    if (!user) {
      // Local Guest tracking
      const guestCount = parseInt(localStorage.getItem("guest_generations") || "0") + 1;
      localStorage.setItem("guest_generations", guestCount.toString());
      // Update local storage representation
      return;
    }
    
    // Update local react state
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        generationsCount: prev.generationsCount + 1
      };
    });
  };

  // Check limits
  const isLimitExceeded = () => {
    return false; // Unlimited free generations for everyone!
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (isLimitExceeded()) {
      alert("You have reached your daily free generation limit. Please upgrade to a Premium plan or log in to get higher limits!");
      return;
    }

    setLoading(true);
    setCopiedAll(false);
    setShared(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: genType,
          topic: topic.trim(),
          platform,
          language,
          style: captionStyle,
          count: hashtagCount
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Generation failed");
      }

      const generated = resData.data;

      // Update state
      const outputObj: any = {
        type: genType,
        topic: topic.trim()
      };

      if (genType === "hashtag") outputObj.hashtagData = generated;
      else if (genType === "caption") outputObj.captionData = generated;
      else if (genType === "title") outputObj.titleData = generated;
      else if (genType === "keyword") outputObj.keywordData = generated;

      setActiveOutput(outputObj);
      recordGeneration();

      // Add to search history list
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        type: genType,
        topic: topic.trim(),
        timestamp: Date.now(),
        data: generated
      };

      setHistory(prev => [newHistoryItem, ...prev.slice(0, 24)]);

    } catch (err: any) {
      console.error(err);
      alert(`AI server response error: ${err.message || "Please check your network setup."}`);
    } finally {
      setLoading(false);
    }
  };

  // Quick Copy individual text
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Copy all hashtags
  const handleCopyAllHashtags = () => {
    if (!activeOutput?.hashtagData) return;
    const h = activeOutput.hashtagData;
    const allTags = [
      ...h.trending,
      ...h.viral,
      ...h.niche,
      ...h.lowCompetition,
      ...h.highReach
    ].join(" ");

    navigator.clipboard.writeText(allTags);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download results as TXT
  const handleDownloadTXT = () => {
    if (!activeOutput) return;
    let content = `HashtagAI Generation Output\n`;
    content += `Topic: ${activeOutput.topic}\n`;
    content += `Type: ${activeOutput.type.toUpperCase()}\n`;
    content += `Timestamp: ${new Date().toLocaleString()}\n`;
    content += `========================================\n\n`;

    if (activeOutput.type === "hashtag" && activeOutput.hashtagData) {
      const h = activeOutput.hashtagData;
      content += `TRENDING:\n${h.trending.join(" ")}\n\n`;
      content += `VIRAL:\n${h.viral.join(" ")}\n\n`;
      content += `NICHE:\n${h.niche.join(" ")}\n\n`;
      content += `LOW COMPETITION:\n${h.lowCompetition.join(" ")}\n\n`;
      content += `HIGH REACH:\n${h.highReach.join(" ")}\n\n`;
      content += `EXPLANATION:\n${h.explanation}\n`;
    } else if (activeOutput.type === "caption" && activeOutput.captionData) {
      activeOutput.captionData.captions.forEach((cap, i) => {
        content += `OPTION ${i + 1}:\n${cap.text}\n`;
        content += `Strategy: ${cap.engagementHook}\n`;
        content += `Tags: ${cap.suggestedTags.join(" ")}\n\n`;
      });
    } else if (activeOutput.type === "title" && activeOutput.titleData) {
      activeOutput.titleData.titles.forEach((tit, i) => {
        content += `${i + 1}. ${tit.title}\n`;
        content += `CTR Strategy: ${tit.ctrStrategy}\n\n`;
      });
    } else if (activeOutput.type === "keyword" && activeOutput.keywordData) {
      content += `KEYWORDS:\n${activeOutput.keywordData.keywords.join(", ")}\n\n`;
      content += `CONTENT IDEAS:\n`;
      activeOutput.keywordData.contentIdeas.forEach((idea, i) => {
        content += `${i + 1}. ${idea.title} [${idea.format}]\n`;
        content += `Outline: ${idea.outline}\n\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HashtagAI-${activeOutput.type}-${activeOutput.topic.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Share generation results
  const handleShare = () => {
    if (!activeOutput) return;
    const mockShareLink = `https://hashtag-ai.studio/share/${activeOutput.type}/${Math.random().toString(36).substring(5)}`;
    navigator.clipboard.writeText(mockShareLink);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Save specific content item or entire output as Favorite
  const toggleFavorite = (text: string) => {
    const isAlreadyFav = favorites.some(fav => fav.content === text);
    if (isAlreadyFav) {
      setFavorites(prev => prev.filter(fav => fav.content !== text));
    } else {
      const newFav: FavoriteItem = {
        id: Math.random().toString(36).substring(7),
        type: activeOutput?.type || "hashtag",
        topic: activeOutput?.topic || topic,
        content: text,
        timestamp: Date.now()
      };
      setFavorites(prev => [newFav, ...prev]);
    }
  };

  // Load old history item back to output
  const loadHistoryItem = (item: HistoryItem) => {
    const outputObj: any = {
      type: item.type,
      topic: item.topic
    };
    if (item.type === "hashtag") outputObj.hashtagData = item.data;
    else if (item.type === "caption") outputObj.captionData = item.data;
    else if (item.type === "title") outputObj.titleData = item.data;
    else if (item.type === "keyword") outputObj.keywordData = item.data;

    setGenType(item.type);
    setTopic(item.topic);
    setActiveOutput(outputObj);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      
      {/* Dynamic Ad space: Header banner */}
      <AdSpace id="header-970x90" type="banner" />

      {/* Main Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Zap className="h-3.5 w-3.5 animate-bounce" />
          <span>Next-Generation Social SEO Intelligence</span>
        </div>
        
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 dark:from-white dark:via-indigo-200 dark:to-slate-100 leading-tight">
          Double Your Reach With <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">AI Social Optimization</span>
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Instantly generate search-optimized viral hashtags, tailored high-converting captions, click-worthy titles, and niche keyword maps for every social platform.
        </p>
      </div>

      {/* Interactive Tool Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-3xl mx-auto">
        {[
          { type: "hashtag", label: "AI Hashtags", icon: Hash, desc: "High reach tags" },
          { type: "caption", label: "AI Captions", icon: AlignLeft, desc: "Engaging copy" },
          { type: "title", label: "AI Titles", icon: Type, desc: "CTR optimization" },
          { type: "keyword", label: "AI Keywords", icon: Search, desc: "Content & SEO ideas" }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = genType === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => setGenType(tab.type as any)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "glass-panel border-slate-200 dark:border-slate-800 text-slate-700 hover:text-indigo-600 hover:border-indigo-500/40 dark:text-slate-300 dark:hover:text-indigo-400"
              }`}
            >
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 ${isSelected ? "text-white animate-pulse" : "text-slate-400 dark:text-slate-500"}`} />
              <span className="text-xs sm:text-sm font-semibold">{tab.label}</span>
              <span className={`text-[10px] hidden sm:block ${isSelected ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Central Input Generator Block */}
      <div className="glass-panel max-w-3xl mx-auto rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/60 dark:border-slate-800/80 relative">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Topic or Keyword Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Search className="h-4 w-4 text-slate-400" />
                <span>Enter Topic, Product, Keyword or Slogan</span>
              </label>
              
              <span className="text-[11px] text-slate-400 font-mono">
                {topic.length}/100 chars
              </span>
            </div>
            
            <input
              type="text"
              required
              maxLength={100}
              placeholder={
                genType === "hashtag" ? "E.g., personal fitness, gluten-free vegan baking, tech gadgets review" :
                genType === "caption" ? "E.g., launch of our new summer coffee menu, workout routine for energy" :
                genType === "title" ? "E.g., testing 10 secret productivity habits, how to buy real estate as teenager" :
                "E.g., digital marketing agencies, travel hacks in Paris"
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
            />
          </div>

          {/* Configuration parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Platform Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Social Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-300"
              >
                {["Instagram", "YouTube", "Facebook", "TikTok", "X (Twitter)", "LinkedIn", "Any Platform"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Response Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-300"
              >
                {["English", "Spanish", "Hindi", "German", "French", "Portuguese", "Japanese"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Dynamic context options */}
            {genType === "hashtag" && (
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Hashtags Count Limit</label>
                <div className="flex gap-3">
                  {[10, 30, 50].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setHashtagCount(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        hashtagCount === num
                          ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Top {num} Tags
                    </button>
                  ))}
                </div>
              </div>
            )}

            {genType === "caption" && (
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Caption Style / Tone</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {["Viral", "Funny", "Emotional", "Professional", "Motivational", "Luxury", "Minimal"].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setCaptionStyle(st)}
                      className={`py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                        captionStyle === st
                          ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Submit Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Optimizing with social intelligence AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Smart {genType === "hashtag" ? "Hashtags" : genType === "caption" ? "Captions" : genType === "title" ? "SEO Titles" : "Keywords"}</span>
              </>
            )}
          </button>

          {/* Daily limit counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/60 pt-4">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Quota: <strong className="text-emerald-600 dark:text-emerald-400">Unlimited (100% Free)</strong></span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-500/10" /> All Pro Features Unlocked
            </span>
          </div>

        </form>
      </div>

      {/* Pre-made Trending Suggestions */}
      <div className="max-w-3xl mx-auto space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <BarChart2 className="h-3.5 w-3.5" />
          <span>Quick Trending Hot Topics</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {trendingCategories.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setTopic(item.value);
                setGenType("hashtag");
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-indigo-600 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              #{item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Results Area */}
      {activeOutput && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Active AI Generation</p>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <span className="truncate max-w-[280px] sm:max-w-md">"{activeOutput.topic}"</span>
              </h2>
            </div>
            
            {/* Global Actions */}
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleDownloadTXT}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>TXT Download</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{shared ? "Link Copied" : "Share Direct"}</span>
              </button>
            </div>
          </div>

          {/* Ad between results */}
          <AdSpace id="results-native" type="in-feed" />

          {/* HASHTAGS GENERATOR LAYOUT */}
          {activeOutput.type === "hashtag" && activeOutput.hashtagData && (
            <div className="space-y-6">
              
              {/* Copy all trigger */}
              <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Ready to copy {activeOutput.hashtagData.trending.length + activeOutput.hashtagData.viral.length + activeOutput.hashtagData.niche.length + activeOutput.hashtagData.lowCompetition.length + activeOutput.hashtagData.highReach.length} optimized hashtags:
                </span>
                <button
                  onClick={handleCopyAllHashtags}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow transition-all cursor-pointer"
                >
                  {copiedAll ? <CheckCircle className="h-3.5 w-3.5 animate-bounce" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedAll ? "Copied All!" : "Copy All Hashtags"}</span>
                </button>
              </div>

              {/* Categorization Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: "Trending", color: "from-amber-500 to-orange-600", desc: "Currently spiking in overall feeds", data: activeOutput.hashtagData.trending },
                  { name: "Viral", color: "from-red-500 to-pink-600", desc: "Extremely high share velocity tags", data: activeOutput.hashtagData.viral },
                  { name: "Niche Focus", color: "from-purple-500 to-indigo-600", desc: "Super targeted user audience interest", data: activeOutput.hashtagData.niche },
                  { name: "Low Competition", color: "from-emerald-500 to-teal-600", desc: "Easy search-result ranking opportunities", data: activeOutput.hashtagData.lowCompetition },
                  { name: "High Reach", color: "from-blue-500 to-indigo-600", desc: "Massive impressions index tags", data: activeOutput.hashtagData.highReach }
                ].map((cat) => (
                  <div key={cat.name} className="glass-panel rounded-xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden flex flex-col">
                    <div className={`bg-gradient-to-r ${cat.color} p-3 text-white text-center`}>
                      <span className="text-xs font-bold uppercase tracking-wider block">{cat.name}</span>
                      <span className="text-[9px] opacity-80 block leading-tight mt-0.5">{cat.desc}</span>
                    </div>
                    
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        {cat.data && cat.data.length > 0 ? (
                          cat.data.map((tag) => {
                            const score = activeOutput.hashtagData?.popularityScores?.[tag] || 80;
                            const isFav = favorites.some(fav => fav.content === tag);
                            return (
                              <div
                                key={tag}
                                className="group flex justify-between items-center p-1.5 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800/40 transition-all text-xs"
                              >
                                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[100px]">{tag}</span>
                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                  {/* Score marker */}
                                  <span className="text-[10px] font-mono font-semibold text-slate-500">{score}%</span>
                                  {/* Copy individual */}
                                  <button
                                    onClick={() => copyText(tag, tag)}
                                    className="p-0.5 hover:text-indigo-600"
                                    title="Copy single tag"
                                  >
                                    {copiedItem === tag ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </button>
                                  {/* Favorite toggle */}
                                  <button
                                    onClick={() => toggleFavorite(tag)}
                                    className={`p-0.5 ${isFav ? "text-amber-500" : "hover:text-amber-500"}`}
                                    title="Add to Favorites"
                                  >
                                    <Star className={`h-3 w-3 ${isFav ? "fill-amber-500" : ""}`} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-[10px] text-slate-400 italic text-center">No tags generated</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strategic Explanation section */}
              {activeOutput.hashtagData.explanation && (
                <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    <Info className="h-4 w-4" />
                    <span>HashtagAI Social Deployment Strategy</span>
                  </div>
                  <p>{activeOutput.hashtagData.explanation}</p>
                </div>
              )}

            </div>
          )}

          {/* CAPTIONS GENERATOR LAYOUT */}
          {activeOutput.type === "caption" && activeOutput.captionData && (
            <div className="space-y-4">
              {activeOutput.captionData.captions.map((cap, i) => {
                const isFav = favorites.some(fav => fav.content === cap.text);
                return (
                  <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 relative space-y-3 shadow-sm hover:shadow transition-all">
                    
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                        Option #{i + 1} • {captionStyle} Tone
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyText(cap.text, `cap-${i}`)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg border border-slate-200/40 dark:border-slate-800 transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
                        >
                          {copiedItem === `cap-${i}` ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedItem === `cap-${i}` ? "Copied" : "Copy Caption"}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleFavorite(cap.text)}
                          className={`p-2 rounded-lg border border-slate-200/40 dark:border-slate-800 transition-all cursor-pointer ${
                            isFav ? "text-amber-500 bg-amber-500/5 border-amber-500/20" : "text-slate-500 hover:text-amber-500"
                          }`}
                        >
                          <Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
                      {cap.text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
                        <p className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Engagement Strategy</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{cap.engagementHook}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-pink-500/5 border border-pink-500/10 space-y-1">
                        <p className="font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                          <Hash className="h-3.5 w-3.5" />
                          <span>Suggested Accents</span>
                        </p>
                        <p className="font-mono text-indigo-600 dark:text-indigo-400 tracking-wide">
                          {cap.suggestedTags.join(" ")}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* TITLES GENERATOR LAYOUT */}
          {activeOutput.type === "title" && activeOutput.titleData && (
            <div className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-md">
              {activeOutput.titleData.titles.map((tit, i) => {
                const isFav = favorites.some(fav => fav.content === tit.title);
                return (
                  <div key={i} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{String(i + 1).padStart(2, "0")}</span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{tit.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic pl-6">{tit.ctrStrategy}</p>
                    </div>

                    <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                      <button
                        onClick={() => copyText(tit.title, `tit-${i}`)}
                        className="p-1.5 border border-slate-200/40 dark:border-slate-800 rounded-lg hover:bg-white text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
                        title="Copy click-optimized title"
                      >
                        {copiedItem === `tit-${i}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>

                      <button
                        onClick={() => toggleFavorite(tit.title)}
                        className={`p-1.5 border border-slate-200/40 dark:border-slate-800 rounded-lg hover:bg-white transition-all cursor-pointer ${
                          isFav ? "text-amber-500" : "text-slate-500"
                        }`}
                        title="Save to Favorites"
                      >
                        <Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* KEYWORDS & IDEAS LAYOUT */}
          {activeOutput.type === "keyword" && activeOutput.keywordData && (
            <div className="space-y-6">
              
              {/* Keywords Tag Pill list */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Search className="h-4 w-4 text-indigo-500" />
                    <span>Highly Related SEO Keywords Map</span>
                  </h4>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeOutput.keywordData?.keywords.join(", ") || "");
                      setCopiedItem("all-keywords");
                      setTimeout(() => setCopiedItem(null), 2000);
                    }}
                    className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedItem === "all-keywords" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy All Keywords</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeOutput.keywordData.keywords.map((kw, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyText(kw, `kw-${idx}`)}
                      className="text-xs font-mono font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 rounded-lg cursor-pointer hover:border-indigo-400 transition-all flex items-center gap-1"
                    >
                      <span>{kw}</span>
                      {copiedItem === `kw-${idx}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 opacity-30" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Related content ideas outlines */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Play className="h-3.5 w-3.5" />
                  <span>AI Generated Creative Social Content Outlines</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOutput.keywordData.contentIdeas.map((idea, i) => {
                    const isFav = favorites.some(fav => fav.content === idea.title);
                    return (
                      <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-600 text-[10px] font-bold uppercase tracking-wider uppercase">
                              {idea.format}
                            </span>
                            
                            <button
                              onClick={() => toggleFavorite(idea.title)}
                              className={`text-slate-400 hover:text-amber-500 transition-all cursor-pointer`}
                            >
                              <Star className={`h-4.5 w-4.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                            </button>
                          </div>

                          <h4 className="text-sm font-semibold text-slate-950 dark:text-white leading-tight">
                            {idea.title}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800/40">
                            {idea.outline}
                          </p>
                        </div>

                        <button
                          onClick={() => copyText(`${idea.title}\nFormat: ${idea.format}\nOutline: ${idea.outline}`, `idea-${i}`)}
                          className="w-full mt-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedItem === `idea-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedItem === `idea-${i}` ? "Copied Outline" : "Copy Outline"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* History and Favorites Side-by-Side Panel */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        
        {/* Search History Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Clock className="h-4.5 w-4.5 text-slate-400" />
            <span>Recent Generation Logs ({history.length})</span>
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              Your recent search and AI optimization history will appear here.
            </p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-indigo-50/50 dark:bg-slate-900/60 dark:hover:bg-slate-800/40 border border-slate-150 dark:border-slate-800/60 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold uppercase tracking-wider text-[9px] text-slate-500">
                      {item.type}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300 truncate max-w-[150px]">
                      {item.topic}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Favorites Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
            <span>Saved Favorites Shelf ({favorites.length})</span>
          </h3>

          {favorites.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              Click the star icon next to any generated item to bookmark it.
            </p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/60 text-xs"
                >
                  <div className="flex flex-col gap-0.5 max-w-[200px]">
                    <span className="text-[9px] text-indigo-500 dark:text-indigo-400 uppercase tracking-widest font-bold">
                      {item.type} • {item.topic}
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-300 truncate font-semibold">
                      {item.content}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    <button
                      onClick={() => copyText(item.content, `fav-copy-${item.id}`)}
                      className="p-1 hover:text-indigo-600 text-slate-400"
                    >
                      {copiedItem === `fav-copy-${item.id}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => setFavorites(prev => prev.filter(f => f.id !== item.id))}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Dynamic Ad space: Footer Banner */}
      <AdSpace id="footer-responsive" type="footer" />

    </div>
  );
}
