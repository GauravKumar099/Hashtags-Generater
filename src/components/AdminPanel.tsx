import {
  Users, DollarSign, Sparkles, BarChart, Settings, ShieldCheck,
  Zap, ToggleLeft, ToggleRight, Trash2, Edit, Save, Plus, BarChart2,
  Clock, AlertCircle, TrendingUp, Info, CheckCircle
} from "lucide-react";
import React, { useState } from "react";
import { UserStats, BlogPost } from "../types";

interface AdminPanelProps {
  user: UserStats | null;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  freeLimit: number;
  setFreeLimit: (limit: number) => void;
}

export default function AdminPanel({
  user,
  blogPosts,
  setBlogPosts,
  freeLimit,
  setFreeLimit
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "users" | "blog" | "settings">("analytics");

  // Simulated site settings
  const [siteName, setSiteName] = useState("HashtagAI");
  const [metaDescription, setMetaDescription] = useState("Generate viral hashtags, captions, video titles, and keywords using AI.");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("G-12345ABCDE");
  const [isAdsenseEnabled, setIsAdsenseEnabled] = useState(true);

  // Status message
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulated User database
  const [usersList, setUsersList] = useState<UserStats[]>([
    {
      uid: "user-1",
      email: "gauravkumar85141@gmail.com",
      displayName: "Gaurav Kumar",
      photoURL: null,
      isPremium: true,
      generationsCount: 142,
      maxGenerations: 9999,
      joinedAt: "2026-06-12",
      plan: "Yearly Unlimited"
    },
    {
      uid: "user-2",
      email: "jane.doe@example.com",
      displayName: "Jane Doe",
      photoURL: null,
      isPremium: false,
      generationsCount: 4,
      maxGenerations: 5,
      joinedAt: "2026-07-01"
    },
    {
      uid: "user-3",
      email: "samantha.smith@gmail.com",
      displayName: "Samantha Smith",
      photoURL: null,
      isPremium: true,
      generationsCount: 29,
      maxGenerations: 9999,
      joinedAt: "2026-07-10",
      plan: "Monthly Unlimited"
    },
    {
      uid: "user-4",
      email: "markus.muller@web.de",
      displayName: "Markus Müller",
      photoURL: null,
      isPremium: false,
      generationsCount: 1,
      maxGenerations: 5,
      joinedAt: "2026-07-11"
    }
  ]);

  const handleTogglePremium = (uid: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.uid === uid) {
        const nextPrem = !u.isPremium;
        return {
          ...u,
          isPremium: nextPrem,
          maxGenerations: nextPrem ? 9999 : 5,
          plan: nextPrem ? "Monthly Unlimited" : undefined
        };
      }
      return u;
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Compute stats
  const totalGenerations = usersList.reduce((acc, u) => acc + u.generationsCount, 0) + (user ? user.generationsCount : 0);
  const totalPremiumCount = usersList.filter(u => u.isPremium).length;
  const simulatedMonthlyRevenue = totalPremiumCount * 19 + 149; // basic calculation

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header and secure state badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-indigo-600" />
            <span>HashtagAI Authority Terminal</span>
          </h1>
          <p className="text-xs text-slate-500">
            Secure admin access authorized for: <strong>gauravkumar85141@gmail.com</strong>
          </p>
        </div>

        {/* Authorization indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM STATE: ROOT DIRECTORY</span>
        </div>
      </div>

      {/* Admin stats dashboard strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Platform Users", value: usersList.length + 1, icon: Users, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
          { label: "Generations Run Today", value: totalGenerations, icon: Sparkles, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
          { label: "Premium Subscribers", value: totalPremiumCount + 1, icon: Zap, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
          { label: "AdSense & SaaS Monthly MRR", value: `$${simulatedMonthlyRevenue}.00`, icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">{stat.label}</span>
                <span className="text-lg sm:text-2xl font-bold font-display text-slate-950 dark:text-white">{stat.value}</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin internal tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-1.5">
        {[
          { id: "analytics", label: "Analytics Overviews", icon: BarChart },
          { id: "users", label: "User Database", icon: Users },
          { id: "blog", label: "Manage Blog Posts", icon: Edit },
          { id: "settings", label: "SaaS Parameters", icon: Settings }
        ].map((sub) => {
          const Icon = sub.icon;
          const isSelected = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide transition-all border-b-2 cursor-pointer ${
                isSelected
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/5"
                  : "border-transparent text-slate-500 hover:text-indigo-600 dark:text-slate-400"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TABS CONTENT */}

      {/* 1. ANALYTICS */}
      {activeSubTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generation share map */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <BarChart2 className="h-4.5 w-4.5 text-indigo-500" />
              <span>AI Feature Load Share Distribution</span>
            </h3>

            <div className="space-y-3.5">
              {[
                { name: "Hashtag Generations", percentage: 48, runs: 124, color: "bg-indigo-600" },
                { name: "Caption Generations", percentage: 26, runs: 67, color: "bg-pink-600" },
                { name: "SEO Clickable Title Generations", percentage: 14, runs: 36, color: "bg-purple-600" },
                { name: "SEO Keywords Maps", percentage: 12, runs: 31, color: "bg-emerald-600" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="text-slate-400 font-mono">{item.percentage}% ({item.runs} runs)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Platform load */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <TrendingUp className="h-4.5 w-4.5 text-pink-500" />
              <span>Top Optimizing Platforms Target Load</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { platform: "Instagram", rank: "#1", load: "High Velocity (40%)" },
                { platform: "YouTube Shorts / Videos", rank: "#2", load: "Growing Spike (28%)" },
                { platform: "TikTok Growth", rank: "#3", load: "Stable Engagement (18%)" },
                { platform: "LinkedIn / Corporate", rank: "#4", load: "Niche Premium (14%)" }
              ].map((p, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-mono font-semibold">{p.rank} Platform</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{p.platform}</p>
                  <p className="text-[10px] text-slate-500">{p.load}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS */}
      {activeSubTab === "users" && (
        <div className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-4">User Identity</th>
                  <th className="py-3 px-4">Active Plan</th>
                  <th className="py-3 px-4">Generations Count</th>
                  <th className="py-3 px-4">Joined At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {usersList.map((usr) => (
                  <tr key={usr.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{usr.displayName || "Anonymous Creator"}</p>
                        <p className="text-[10px] text-slate-400">{usr.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {usr.isPremium ? (
                        <span className="inline-flex items-center gap-1 bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 font-semibold px-2 py-0.5 rounded text-[10px]">
                          <Zap className="h-3 w-3 fill-pink-500" />
                          <span>{usr.plan || "Premium User"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[10px]">
                          Free Tier (5 Max)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {usr.generationsCount} runs
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {usr.joinedAt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleTogglePremium(usr.uid)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          usr.isPremium
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-600 hover:bg-amber-500/25"
                            : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {usr.isPremium ? "Revoke Premium" : "Grant Premium"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BLOG POSTS */}
      {activeSubTab === "blog" && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
              <span>Full Blog Directory ({blogPosts.length} Articles)</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {blogPosts.map((post) => (
              <div key={post.id} className="py-3.5 flex items-center justify-between text-xs gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{post.title}</h4>
                  <p className="text-[10px] text-slate-400">
                    Category: <strong className="text-indigo-500">{post.category}</strong> • Date: {post.date}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert("Please use the edit buttons directly in the Knowledge Hub tab to modify posts visually.");
                      setActiveSubTab("blog");
                    }}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded border border-slate-100 dark:border-slate-800"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm("Delete this blog article?")) {
                        setBlogPosts(prev => prev.filter(p => p.id !== post.id));
                      }
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded border border-slate-100 dark:border-slate-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SETTINGS */}
      {activeSubTab === "settings" && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Daily Free Generation Quota Limit</label>
                <input
                  type="number"
                  value={freeLimit}
                  onChange={(e) => setFreeLimit(Math.max(1, parseInt(e.target.value) || 5))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">SaaS Brand Label</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Google Analytics ID Integration</label>
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-300">Enable Google AdSense</p>
                    <p className="text-[10px] text-slate-400">Renders ad spaces inside dashboards</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdsenseEnabled(!isAdsenseEnabled)}
                    className="text-slate-500"
                  >
                    {isAdsenseEnabled ? <ToggleRight className="h-8 w-8 text-indigo-600" /> : <ToggleLeft className="h-8 w-8" />}
                  </button>
                </div>
              </div>

            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Global SEO Meta Description</label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none dark:text-white"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Info className="h-3.5 w-3.5" />
                <span>Values are compiled instantly to metadata.json in real-time.</span>
              </span>
              
              <button
                type="submit"
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>

            {saveSuccess && (
              <p className="text-center text-emerald-500 font-bold text-[11px] animate-pulse">
                ✓ SaaS parameter configs compiled successfully!
              </p>
            )}

          </form>
        </div>
      )}

    </div>
  );
}
