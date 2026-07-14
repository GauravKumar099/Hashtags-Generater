import { Sparkles, Mail, Send, CheckCircle } from "lucide-react";
import React, { useState } from "react";

interface FooterProps {
  setTab: (tab: string) => void;
}

export default function Footer({ setTab }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-4 border-t border-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand and pitch */}
        <div className="md:col-span-1.5 flex flex-col gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab("home")}>
            <div className="bg-gradient-to-tr from-indigo-600 to-pink-500 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              HashtagAI
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            The complete SaaS content optimization tool. Generate high-reach hashtags, engaging captions, CTR-focused titles, and high-quality SEO keywords in seconds using our custom trained social AI model.
          </p>
          <p className="text-xs text-slate-500">
            © 2026 HashtagAI. Designed for elite content creators & search engine positioning.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
            Product & Content
          </h4>
          <ul className="space-y-2.5 text-sm">
            {["Home", "Features", "Pricing", "Blog", "About", "FAQ"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => setTab(item.toLowerCase())}
                  className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Agreements */}
        <div>
          <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
            Legal & Compliance
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Privacy Policy", tab: "privacy-policy" },
              { label: "Terms & Conditions", tab: "terms-conditions" },
              { label: "Cookie Policy", tab: "cookie-policy" },
              { label: "Disclaimer", tab: "disclaimer" }
            ].map((item) => (
              <li key={item.tab}>
                <button
                  onClick={() => setTab(item.tab)}
                  className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          {/* AdSense Verification Notice */}
          <div className="mt-4 p-2.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500">
            AdSense Safe & Compliance Checked. Custom XML Sitemaps and structured JSON-LD Schema.org metadata active.
          </div>
        </div>

        {/* Newsletter subscription */}
        <div>
          <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
            Creator Insights
          </h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Get the latest social media growth tips, viral trends, and AI prompts delivered straight to your inbox weekly.
          </p>
          
          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 px-3.5 pr-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
            >
              {subscribed ? <CheckCircle className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </form>

          {subscribed && (
            <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 block animate-pulse">
              ✓ Subscribed! Thank you for joining us.
            </span>
          )}
        </div>

      </div>
    </footer>
  );
}
