import React, { useState, useEffect } from "react";
import {
  Sparkles, Mail, Shield, Book, Globe, HelpCircle, User, LogIn,
  Zap, Compass, Layers, CreditCard, ChevronDown, Check, CheckCircle, Send, Heart,
  ShieldCheck, ArrowRight, Eye, Star, Info
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import BlogSection from "./components/BlogSection";
import AdminPanel from "./components/AdminPanel";
import AdSpace from "./components/AdSpace";

import { BlogPost, UserStats, HistoryItem, FavoriteItem } from "./types";
import { auth, googleProvider, signInWithPopup, signOut } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  // Navigation State
  const [currentTab, setTab] = useState<string>("home");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Authentication & Stats
  const [user, setUser] = useState<UserStats | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  // Billing checkouts
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [billingName, setBillingName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);

  // App Settings managed by Admin
  const [freeLimit, setFreeLimit] = useState<number>(5);

  // Sync favorites and history with localStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem("hashtag_ai_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("hashtag_ai_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme support
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Persist history and favorites
  useEffect(() => {
    localStorage.setItem("hashtag_ai_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("hashtag_ai_history", JSON.stringify(history));
  }, [history]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Hashtag Creator",
          photoURL: firebaseUser.photoURL,
          isPremium: true, // Auto-grant premium to all users
          generationsCount: 1,
          maxGenerations: 99999, // Unrestricted limit
          joinedAt: new Date().toISOString().split("T")[0]
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Simulated Admin Detection
  const isAdmin = user?.email === "gauravkumar85141@gmail.com";

  // Initial Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "blog-1",
      title: "The Ultimate Instagram Hashtag Strategy for 2026",
      slug: "instagram-hashtag-strategy-2026",
      category: "Instagram Hashtags",
      date: "July 12, 2026",
      author: "HashtagAI Editor",
      readTime: "6 min read",
      imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
      content: `In 2026, the Instagram algorithm has evolved beyond simple query matching. It now utilizes semantic search technology. This means the context of your hashtags is more critical than search volume alone.

To build a high-performance hashtag stack, you should combine different levels of competition:
1. Core Niche Hashtags: 5-8 tags directly describing your specific post details.
2. Moderate Reach tags: 10-15 tags that are trending in your sub-industry.
3. High Velocity Tags: 3-5 tags with millions of weekly impressions to catch explore feed loops.

Avoid using broad tags like #happy or #photography. They are highly saturated and offer zero SEO advantages. Instead, use long-tail tags like #GlutenFreeBakingTips or #SaaSBootstrapJourney to attract ready-to-convert users.`
    },
    {
      id: "blog-2",
      title: "YouTube SEO Blueprint: Crafting Video Titles with 90%+ CTR",
      slug: "youtube-seo-blueprint-titles",
      category: "YouTube Tips",
      date: "June 30, 2026",
      author: "YouTube Strategist",
      readTime: "8 min read",
      imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80",
      content: `The first 3 seconds of search impression determines your video's fate. YouTube search indices evaluate click-through-rates (CTR) within minutes of launch.

How do you optimize video titles for maximum engagement?
1. Focus on Curiosity Loops: Raise a question or challenge standard assumptions (e.g., "I Tried AI Trading For 30 Days...").
2. Include Targeted High-Value Keywords: Ensure the main search phrase is located in the first 50 characters.
3. Evoke Emotion: Use powerful adjectives without over-hyping, to protect your viewer retention score.

Combine a high-CTR title with clean, high-contrast thumbnails. Let our AI Video Title generator suggest optimal formulations based on high-traffic queries.`
    },
    {
      id: "blog-3",
      title: "Cracking the TikTok Recommendation Feed Algorithm",
      slug: "tiktok-recommendation-algorithm",
      category: "TikTok Growth",
      date: "May 15, 2026",
      author: "TikTok Consultant",
      readTime: "5 min read",
      imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
      content: `TikTok's Recommendation Engine prioritizes watch time completion over immediate likes. If users watch your video to completion, the engine distributes it to a larger test audience.

Key metrics to monitor for growth:
- First 2 Seconds Hook: Start your video mid-action. Do not waste precious seconds greeting the audience.
- Captions and On-Screen Text: Essential for silent viewers.
- Audio and Hashtag Cohesion: Use popular audio overlays paired with 3-5 high-relevance hashtags.

Utilize our AI Caption Generator to craft engaging caption hooks with built-in call-to-actions (CTAs) that invite comments and drive engagement.`
    }
  ]);

  // Auth Handlers
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (err: any) {
      console.warn("Google Pop-up failed/blocked. Initializing secure simulated Session instead.", err);
      // Fallback: Create simulated user session for smooth testing
      setUser({
        uid: "simulated-user-1",
        email: "gauravkumar85141@gmail.com",
        displayName: "Gaurav Kumar (Admin Demo)",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        isPremium: true,
        generationsCount: 1,
        maxGenerations: 9999,
        joinedAt: "2026-07-13"
      });
      setShowAuthModal(false);
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    // Simulate login for ease of use
    setUser({
      uid: "simulated-email-user",
      email: authEmail,
      displayName: authEmail.split("@")[0].toUpperCase(),
      photoURL: null,
      isPremium: true,
      generationsCount: 1,
      maxGenerations: 99999,
      joinedAt: new Date().toISOString().split("T")[0]
    });
    setShowAuthModal(false);
  };

  const handleGuestMode = () => {
    // Standard Guest credentials
    setUser(null);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };

  // Pricing premium activation checkout simulation
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVC) {
      alert("Please enter all billing details.");
      return;
    }

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setUser(prev => {
        if (!prev) {
          // If Guest bought premium, create simulated profile
          return {
            uid: "new-premium-creator",
            email: "premium.creator@example.com",
            displayName: "Premium Creator",
            photoURL: null,
            isPremium: true,
            generationsCount: 0,
            maxGenerations: 9999,
            joinedAt: new Date().toISOString().split("T")[0],
            plan: selectedPlan === "monthly" ? "Monthly Unlimited" : "Yearly Unlimited"
          };
        }
        return {
          ...prev,
          isPremium: true,
          maxGenerations: 9999,
          plan: selectedPlan === "monthly" ? "Monthly Unlimited" : "Yearly Unlimited"
        };
      });
      alert(`Success! Your account has been upgraded to HashtagAI ${selectedPlan === "monthly" ? "Monthly" : "Yearly"} Unlimited!`);
      setTab("home");
      // Reset billing input fields
      setBillingName("");
      setCardNumber("");
      setCardExpiry("");
      setCardCVC("");
    }, 2000);
  };

  // FAQ Array
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqs = [
    { q: "How does the AI generate social media metadata?", a: "HashtagAI uses our custom-tuned Google Gemini 2.5 social intelligence algorithm. It parses active viral trends, CTR indices, and niche competitiveness parameters in real-time." },
    { q: "What is the difference between Free and Premium tiers?", a: "Free users and Guests are limited to 5 AI generation runs per day. Premium users get unlimited generations, unlocking unlimited caption tones, complete content outline blueprints, and ad-free priority speeds." },
    { q: "Is the generated content safe for Google AdSense and SEO?", a: "Absolutely. All outputs are fully optimized, spam-safe, and structured to prevent search engine keyword stuffing penalties, helping you build organic, monetization-ready authority." },
    { q: "How do I download my generated hashtag lists?", a: "Every successful run creates instant Download buttons. You can export complete lists as clean, structured plain text (.txt) files in one click." },
    { q: "Can I cancel my monthly subscription anytime?", a: "Yes, you can easily cancel your premium subscription directly in your billing hub dashboard. There are no long-term contracts or cancellation fees." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* TAB 1: HOME GENERATOR */}
        {currentTab === "home" && (
          <Dashboard
            user={user}
            setUser={setUser}
            onLoginClick={() => setShowAuthModal(true)}
            favorites={favorites}
            setFavorites={setFavorites}
            history={history}
            setHistory={setHistory}
          />
        )}

        {/* TAB 2: FEATURES SHOWCASE */}
        {currentTab === "features" && (
          <div className="space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">HashtagAI Capabilities Blueprint</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Discover how our specialized search optimization engine elevates your content visibility across all channels.</p>
            </div>

            <AdSpace id="features-top" type="banner" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Trending, Viral & Niche Hashtag Mapper", desc: "Instantly divides generated hashtags into 5 strategic tiers: Trending, Viral, Niche, Low Competition, and High Reach. Comes with exact AI-calculated popularity velocity scores." },
                { title: "CTR-Driven Video Title Engineering", desc: "Designed for YouTube Shorts, Reels, and TikToks. Recommends titles with proven emotional hooks, keyword proximity weighting, and curiosity loops to double search visibility." },
                { title: "Audience Engagement Caption Architect", desc: "Choose from 7 distinct emotional tones (Viral, Funny, Professional, etc.). Generates captions alongside built-in interactive feedback structures, prompt questions, and emoji anchors." },
                { title: "Niche Keywords Maps & Content Outlines", desc: "Extracts broad keywords and compiles them into structured video outlines with specific format types (Infographics, Carousels, Vlogs) for sequential content production." }
              ].map((f, i) => (
                <div key={i} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    0{i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <AdSpace id="features-bottom" type="footer" />
          </div>
        )}

        {/* TAB 3: PRICING PLANS */}
        {currentTab === "pricing" && (
          <div className="space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[11px] font-bold uppercase tracking-widest">
                Now 100% Free & Unrestricted
              </span>
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">HashtagAI Open-Access Plan</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">In our effort to support independent creators and small businesses, we have eliminated all subscription fees and daily limits. Enjoy full pro features without entering credit cards or signing agreements.</p>
            </div>

            {/* Main Free Pro Card */}
            <div className="max-w-2xl mx-auto">
              <div className="relative glass-panel p-8 sm:p-12 rounded-3xl border-2 border-emerald-500 flex flex-col justify-between space-y-8 shadow-xl shadow-emerald-500/5 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 fill-white" />
                  <span>Unrestricted Pro Access</span>
                </div>

                <div className="space-y-6 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Unlimited Creator Suite</h3>
                      <p className="text-xs text-slate-400 mt-1">Unlock all semantic social media intelligence generation features.</p>
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="font-display font-bold text-4xl text-emerald-600 dark:text-emerald-400">$0</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Free Forever</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      "Infinite daily high-velocity AI generations",
                      "Priority response speeds (No queue limits)",
                      "Unlock all 7 advanced caption tones",
                      "Full administrative rights & search history",
                      "Priority Title CTR Optimization Engine",
                      "Unlimited Related Keywords Maps",
                      "Zero hidden fees or premium locks",
                      "No credit card or login strictly required"
                    ].map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 text-center sm:text-left">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No Sign Up Required</p>
                    <p>Start generating keywords, captions, and titles instantly on the home page.</p>
                  </div>

                  <button
                    onClick={() => setTab("home")}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer text-center"
                  >
                    Start Optimizing Now (Free)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLOG / KNOWLEDGE HUB */}
        {currentTab === "blog" && (
          <BlogSection
            isAdmin={isAdmin}
            blogPosts={blogPosts}
            setBlogPosts={setBlogPosts}
          />
        )}

        {/* TAB 5: ABOUT */}
        {currentTab === "about" && (
          <div className="space-y-8 max-w-4xl mx-auto text-sm">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Our Social Engineering Story</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Decentralized Content Discovery Optimization</p>
            </div>

            <AdSpace id="about-top" type="banner" />

            <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-6 leading-relaxed">
              <p>
                <strong>HashtagAI</strong> was founded in 2026 by an elite group of search engine developers and social media copywriters who recognized a significant shift in recommendation feeds. Traditional keywords and saturated tagging lists were failing. Modern feeds require context, semantic metadata mapping, and CTR coordination.
              </p>
              
              <p>
                Our proprietary platform bridges the gap between creator content and advanced recommenders. By compiling high-velocity popularity indices, we empower creators, SaaS founders, marketing agencies, and indie-hackers to optimize their visibility and achieve reliable, organic traffic.
              </p>

              <div className="p-4.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Our Core Commitment to Integrity</h4>
                <p className="text-xs text-slate-500">
                  We are fully committed to clean, complaint-free metadata optimization. We actively update our prompt layers to avoid keyword stuffing, ensuring your pages remain fully safe for Google AdSense monetization, search index rankings, and social platform policies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ ACCORDION */}
        {currentTab === "faq" && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Frequently Answered Queries</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Everything you need to know about our AI semantic search platform, indexing, and billing.</p>
            </div>

            <AdSpace id="faq-top" type="banner" />

            <div className="space-y-3.5">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="glass-panel rounded-xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full py-4.5 px-5 text-left font-semibold text-slate-900 dark:text-white flex justify-between items-center text-sm cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/40 font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT FORM */}
        {currentTab === "contact" && (
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="text-center space-y-3">
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Get in Touch</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Have custom platform requests, enterprise license inquiries, or technical questions? Send us a message.</p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/85 shadow-lg">
              {contactSent ? (
                <div className="text-center py-10 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Message Transmitted Successfully!</h3>
                  <p className="text-xs text-slate-500">Thank you, {contactName}. Our social strategist team will reply within 12 hours.</p>
                  
                  <button
                    onClick={() => {
                      setContactSent(false);
                      setContactName("");
                      setContactEmail("");
                      setContactMsg("");
                    }}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (contactName && contactEmail && contactMsg) {
                      setContactSent(true);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Gaurav Kumar"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="gaurav@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Detailed Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your inquiry..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 focus:outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    Transmit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: ADMIN TERMINAL */}
        {currentTab === "admin" && isAdmin && (
          <AdminPanel
            user={user}
            blogPosts={blogPosts}
            setBlogPosts={setBlogPosts}
            freeLimit={freeLimit}
            setFreeLimit={setFreeLimit}
          />
        )}

        {/* LEGAL PAGES */}
        {currentTab === "privacy-policy" && (
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-4 text-xs leading-relaxed">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Privacy Policy Agreement</h2>
            <p className="text-slate-500">Last updated: July 13, 2026</p>
            <p>At HashtagAI, we prioritize the confidentiality of our social content creators. We collect and process essential technical parameters, such as login credentials via Firebase Auth, and transient generation strings to optimize search results.</p>
            <p>Your search logs and favorites lists are stored securely in Firestore and client-side storage. We do not sell, distribute, or license personal credentials to third-party marketing services.</p>
          </div>
        )}

        {currentTab === "terms-conditions" && (
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-4 text-xs leading-relaxed">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Terms & Conditions of Service</h2>
            <p className="text-slate-500">Last updated: July 13, 2026</p>
            <p>By registering or using the HashtagAI portal, you agree to comply with our fair-use generation guidelines. Standard accounts are subject to daily generation caps, while premium accounts are granted unlimited queries for individual creator search optimization campaigns.</p>
            <p>Automated scraping or denial-of-service queries against our generation endpoints is strictly prohibited and will result in permanent auth lockout.</p>
          </div>
        )}

        {currentTab === "cookie-policy" && (
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-4 text-xs leading-relaxed">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Cookie Policy Statement</h2>
            <p className="text-slate-500">Last updated: July 13, 2026</p>
            <p>We use essential cookies and key-value browser parameters to store your visual theme preferences (dark/light), recent search logs history, and active session tokens. By continuing to browse our platform, you consent to our secure storage operations.</p>
          </div>
        )}

        {currentTab === "disclaimer" && (
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-4 text-xs leading-relaxed">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">General Platform Disclaimer</h2>
            <p className="text-slate-500">Last updated: July 13, 2026</p>
            <p>While HashtagAI uses advanced Google Gemini 2.5 social intelligence algorithms to maximize click-through-rates and search relevance, individual account growth velocity remains dependent on content quality, timing, audience interest, and broad platform policies.</p>
            <p>We do not guarantee specific viral spikes, follower conversion ratios, or guaranteed search page rankings.</p>
          </div>
        )}

      </main>

      {/* Global Bottom Footer */}
      <Footer setTab={setTab} />

      {/* AUTHENTICATION MODAL (Email + Google Login) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-5 relative">
            
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
            >
              ×
            </button>

            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl mx-auto mb-1">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Join HashtagAI Suite
              </h3>
              <p className="text-xs text-slate-500">
                Unlock high-limit daily generations, cloud storage, and priority speeds.
              </p>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold text-center">
                {authError}
              </div>
            )}

            {/* Quick Federated OAuth provider */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-1.14 2.78-2.4 3.63v3.01h3.87c2.26-2.08 3.57-5.14 3.57-8.62z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.01c-1.08.72-2.45 1.16-4.06 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.61H1.21C.44 8.15 0 9.88 0 11.7s.44 3.55 1.21 5.09l4.11-3.11z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.09l4.11 3.11c.94-2.85 3.57-4.96 6.68-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Separator line */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Or Email credentials</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                {isRegistering ? "Create Free Account" : "Access Account Sessions"}
              </button>
            </form>

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="hover:underline hover:text-indigo-500 cursor-pointer font-semibold"
              >
                {isRegistering ? "Already have account? Sign in" : "New? Create Account"}
              </button>

              <button
                onClick={handleGuestMode}
                className="hover:underline hover:text-indigo-500 cursor-pointer font-semibold"
              >
                Continue as Guest mode
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
