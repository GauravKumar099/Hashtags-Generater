import { Sparkles, Sun, Moon, LogIn, LogOut, ShieldAlert, Zap, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { UserStats } from "../types";

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  user: UserStats | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isAdmin: boolean;
}

export default function Navbar({
  currentTab,
  setTab,
  darkMode,
  setDarkMode,
  user,
  onLoginClick,
  onLogout,
  isAdmin
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Home", tab: "home" },
    { label: "Features", tab: "features" },
    { label: "Pricing", tab: "pricing" },
    { label: "Blog", tab: "blog" },
    { label: "About", tab: "about" },
    { label: "FAQ", tab: "faq" }
  ];

  const handleTabChange = (tab: string) => {
    setTab(tab);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange("home")}>
            <div className="bg-gradient-to-tr from-indigo-600 to-pink-500 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              HashtagAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleTabChange(item.tab)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTab === item.tab
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Controls / Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200"
              title="Toggle view theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Admin Badge/Link */}
            {isAdmin && (
              <button
                onClick={() => handleTabChange("admin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border border-amber-500/30 text-amber-600 dark:text-amber-400 transition-all ${
                  currentTab === "admin" ? "bg-amber-500/15" : "hover:bg-amber-500/10"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.displayName || "Guest User"}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Sparkles className="h-2.5 w-2.5 fill-emerald-500/10" /> Unlimited Pro
                  </span>
                </div>
                
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-all"
                  title="Log out session"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In / Register</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu panel */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800/80 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {menuItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleTabChange(item.tab)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === item.tab
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleTabChange("admin")}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-base font-medium text-amber-600 dark:text-amber-400 ${
                currentTab === "admin" ? "bg-amber-500/15" : "hover:bg-amber-500/10"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Admin Panel</span>
            </button>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="h-9 w-9 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <User className="h-4.5 w-4.5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {user.displayName || "Guest User"}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Unlimited Pro Plan
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-sm text-red-500 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-500/15 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
