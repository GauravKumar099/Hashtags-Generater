import { Megaphone } from "lucide-react";
import { useState } from "react";

interface AdSpaceProps {
  id: string;
  type: "banner" | "sidebar" | "in-feed" | "footer";
  className?: string;
}

export default function AdSpace({ id, type, className = "" }: AdSpaceProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const typeConfig = {
    banner: {
      height: "h-24 sm:h-28",
      width: "w-full",
      label: "Responsive Leaderboard Banner (728x90 or 970x90)",
      description: "Optimized for AdSense auto-ads or display ads. Automatically sizes based on screen width."
    },
    sidebar: {
      height: "h-64 sm:h-[400px]",
      width: "w-full max-w-[300px]",
      label: "Premium Sidebar Display Ad (300x250 or 300x600)",
      description: "Sticky high-CTR placement. Ideal for target CPM optimization."
    },
    "in-feed": {
      height: "h-32",
      width: "w-full",
      label: "In-Feed Native Ad (Matches content styling)",
      description: "Blends smoothly with social posts and generated hashtag lists to prevent banner blindness."
    },
    footer: {
      height: "h-20",
      width: "w-full",
      label: "Footer Anchor Ad / Horizontal Banner (468x60 or Mobile)",
      description: "Stays locked or responsive near bottom of the viewport for maximum viewability."
    }
  };

  const current = typeConfig[type];

  return (
    <div
      id={`ad-space-${id}`}
      className={`relative mx-auto my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 p-4 transition-all duration-300 overflow-hidden ${current.height} ${current.width} ${className}`}
    >
      {/* Visual background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Megaphone className="h-3.5 w-3.5" />
          <span>Sponsored Advertisement Space</span>
        </div>
        <p className="mt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {current.label}
        </p>
        <p className="hidden md:block mt-1 text-[10px] text-slate-400 dark:text-slate-500 max-w-lg">
          {current.description}
        </p>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1.5 right-2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        title="Hide ad placement for preview session"
      >
        × Dismiss
      </button>

      {/* Actual AdSense Tag representation (inactive but syntactically structured for validation) */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%", position: "absolute", opacity: 0, pointerEvents: "none" }}
        data-ad-client="ca-pub-1234567890"
        data-ad-slot={id}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
