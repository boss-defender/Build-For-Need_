import { User, UserRole } from "../types";
import { LogOut, BookOpen, Sparkles, HelpCircle, Code, User as UserIcon, Lightbulb, Menu, X, Sun, Moon, Heart, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRoleSwitch: (newRole: UserRole) => void;
  onLogout: () => void;
}

export function Header({ currentUser, activeTab, setActiveTab, onRoleSwitch, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [mobileConfirmSignOut, setMobileConfirmSignOut] = useState(false);

  // Prevent body scrolling when mobile drawer navigation is active, cleanly restoring scroll behavior on unmount or close
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileConfirmSignOut(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header id="app-main-header" className="sticky top-0 z-[100] w-full border-b border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1600px] px-[clamp(1rem,4vw,3rem)] py-2 transition-all">
        <div className="flex h-16 items-center justify-between gap-6 lg:gap-10">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-100 dark:shadow-none">
              <Sparkles className="h-5.5 w-5.5 animate-pulse" />
            </div>
            <span className="text-[clamp(15px,1.1vw,20px)] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans hidden sm:inline-block">
              Build For Need
            </span>
          </div>

          {/* Navigation Items (Desktop) - Enhanced responsive gap and padding */}
          <nav className="hidden md:flex items-center gap-[clamp(0.5rem,1.2vw,1.75rem)]">
            <button
              onClick={() => { setActiveTab("feed"); setMobileMenuOpen(false); }}
              className={`px-[clamp(0.75rem,0.9vw,1.25rem)] py-[clamp(0.4rem,0.6vw,0.6rem)] rounded-xl text-[clamp(13px,0.95vw,15px)] font-bold transition-all cursor-pointer ${
                activeTab === "feed"
                  ? "bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              Problem Feed
            </button>
            <button
              onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
              className={`px-[clamp(0.75rem,0.9vw,1.25rem)] py-[clamp(0.4rem,0.6vw,0.6rem)] rounded-xl text-[clamp(13px,0.95vw,15px)] font-bold transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => { setActiveTab("faq"); setMobileMenuOpen(false); }}
              className={`px-[clamp(0.75rem,0.9vw,1.25rem)] py-[clamp(0.4rem,0.6vw,0.6rem)] rounded-xl text-[clamp(13px,0.95vw,15px)] font-bold transition-all cursor-pointer ${
                activeTab === "faq"
                  ? "bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }}
              className={`px-[clamp(0.75rem,0.9vw,1.25rem)] py-[clamp(0.4rem,0.6vw,0.6rem)] rounded-xl text-[clamp(13px,0.95vw,15px)] font-bold transition-all cursor-pointer ${
                activeTab === "donate"
                  ? "bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              Donate
            </button>
          </nav>

          {/* Role Toggle Switch & User Section */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            
            {/* Liquid-glass Animated Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center h-10 w-10 rounded-xl border border-slate-250/30 dark:border-slate-700/60 bg-slate-50/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer backdrop-blur-xs transition-colors p-2"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  >
                    <Sun className="h-4.5 w-4.5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  >
                    <DarkMoonIcon />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {currentUser && activeTab === "feed" && (
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800/60 p-1 border border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => onRoleSwitch(UserRole.PROBLEM_SHARER)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    currentUser.rolePreference === UserRole.PROBLEM_SHARER
                      ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs border border-slate-200/30"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-indigo-200"
                  }`}
                  title="Switch to Problem Sharer view"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sharer</span>
                </button>
                <button
                  onClick={() => onRoleSwitch(UserRole.DEVELOPER)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    currentUser.rolePreference === UserRole.DEVELOPER
                      ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-350 shadow-xs border border-slate-200/30"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-indigo-200"
                  }`}
                  title="Switch to Developer view"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dev</span>
                </button>
              </div>
            )}

            {/* Profile & Signout UI */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-2 relative">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 capitalize bg-slate-50 dark:bg-slate-800/50 border border-slate-100/55 dark:border-slate-700/40 rounded px-1.5 py-0.5 mt-0.5 tracking-wider font-mono">
                    {currentUser.rolePreference.replace('_', ' ')}
                  </span>
                </div>

                {/* Custom STATEFUL LOGOUT POPOVER */}
                {mobileMenuOpen ? null : (
                  <AnimatePresence>
                    {showConfirmLogout && (
                      <div className="absolute right-0 top-12 z-50 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl shadow-xl flex flex-col gap-2 min-w-[160px] animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Confirm Sign Out?</span>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setShowConfirmLogout(false)}
                            className="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-slate-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer focus:ring-2 focus:ring-indigo-505"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setShowConfirmLogout(false);
                              onLogout();
                            }}
                            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-rose-505"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                )}

                <button
                  onClick={() => setShowConfirmLogout(!showConfirmLogout)}
                  className={`rounded-xl border p-2.5 transition-all focus:outline-hidden cursor-pointer ${
                    showConfirmLogout
                      ? "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-100 dark:hover:border-rose-900"
                  }`}
                  title="Sign out of account"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {/* Mobile Menu trigger */}
            <button
              id="mobile-hamburger-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden shrink-0 relative z-[200] rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer min-w-[44px] min-h-[44px] w-11 h-11 items-center justify-center transition-all shadow-xs pointer-events-auto"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated mobile drawer-based navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className={`fixed inset-0 z-[9998] backdrop-blur-md cursor-pointer ${
                theme === "dark" ? "bg-slate-950/90" : "bg-slate-900/60"
              }`}
            />
            {/* Full-screen Overlay Content */}
            <motion.div
              key="mobile-nav-drawer"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`header-mobile-menu-container fixed inset-0 z-[9999] w-screen h-[100dvh] flex flex-col justify-between shadow-2xl p-[clamp(1rem,4vw,3rem)] focus:outline-hidden ${
                theme === "dark"
                  ? "bg-slate-950 text-slate-100"
                  : "bg-slate-50 text-slate-900"
              }`}
            >
              {/* Perfect matched header within overlay */}
              <div className="w-full flex items-center justify-between h-16 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md">
                    <Sparkles className="h-5.5 w-5.5 animate-pulse" />
                  </div>
                  <span className="text-md font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                    Build For Need
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-750 p-2.5 text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer w-11 h-11 flex items-center justify-center transition-all shadow-xs"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main centered navigation content - Centered perfectly vertically and horizontally */}
              <div className="flex-1 flex flex-col justify-center items-center py-6 gap-8 w-full max-w-sm mx-auto shrink-0 select-none">
                <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider font-mono select-none">
                  Navigation Menu
                </span>

                <nav className="flex flex-col gap-4 w-full items-center">
                  <button
                    onClick={() => { setActiveTab("feed"); setMobileMenuOpen(false); }}
                    className={`px-6 py-4.5 rounded-2xl text-[20px] font-bold transition-all w-full flex items-center justify-between border cursor-pointer hover:shadow-md active:scale-[0.98] ${
                      activeTab === "feed"
                        ? "bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-500/10"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <BookOpen className={`w-5.5 h-5.5 shrink-0 ${activeTab === "feed" ? "text-white" : "text-indigo-505"}`} />
                      <span>Problem Feed</span>
                    </div>
                    {activeTab === "feed" && <Check className="w-5 h-5 text-indigo-200" />}
                  </button>

                  <button
                    onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
                    className={`px-6 py-4.5 rounded-2xl text-[20px] font-bold transition-all w-full flex items-center justify-between border cursor-pointer hover:shadow-md active:scale-[0.98] ${
                      activeTab === "about"
                        ? "bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-500/10"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Sparkles className={`w-5.5 h-5.5 shrink-0 ${activeTab === "about" ? "text-white" : "text-indigo-505"}`} />
                      <span>About Us</span>
                    </div>
                    {activeTab === "about" && <Check className="w-5 h-5 text-indigo-200" />}
                  </button>

                  <button
                    onClick={() => { setActiveTab("faq"); setMobileMenuOpen(false); }}
                    className={`px-6 py-4.5 rounded-2xl text-[20px] font-bold transition-all w-full flex items-center justify-between border cursor-pointer hover:shadow-md active:scale-[0.98] ${
                      activeTab === "faq"
                        ? "bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-500/10"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <HelpCircle className={`w-5.5 h-5.5 shrink-0 ${activeTab === "faq" ? "text-white" : "text-indigo-505"}`} />
                      <span>FAQ</span>
                    </div>
                    {activeTab === "faq" && <Check className="w-5 h-5 text-indigo-200" />}
                  </button>

                  <button
                    onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }}
                    className={`px-6 py-4.5 rounded-2xl text-[20px] font-bold transition-all w-full flex items-center justify-between border cursor-pointer hover:shadow-md active:scale-[0.98] ${
                      activeTab === "donate"
                        ? "bg-rose-600 border-rose-700 text-white shadow-lg shadow-rose-500/10"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Heart className={`w-5.5 h-5.5 shrink-0 ${activeTab === "donate" ? "text-white fill-white" : "text-rose-500 fill-rose-500"}`} />
                      <span>Donate</span>
                    </div>
                    {activeTab === "donate" && <Check className="w-5 h-5 text-rose-200" />}
                  </button>
                </nav>

                {currentUser && (
                  <div className="w-full space-y-2">
                    {!mobileConfirmSignOut ? (
                      <button
                        onClick={() => setMobileConfirmSignOut(true)}
                        className="px-6 py-4.5 rounded-2xl text-[18px] font-bold transition-all w-full flex items-center justify-between border cursor-pointer hover:shadow-md bg-white dark:bg-slate-900 text-rose-650 dark:text-rose-450 border-rose-200/55 dark:border-rose-900/40 hover:bg-rose-50/50 dark:hover:bg-rose-950/25 active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3.5">
                          <LogOut className="w-5.5 h-5.5 shrink-0 text-rose-550" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    ) : (
                      <div className="border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl p-4.5 space-y-3.5">
                        <p className="text-center font-bold text-[15px] text-rose-650 dark:text-rose-400">
                          Are you sure you want to sign out?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setMobileConfirmSignOut(false)}
                            className="py-3 px-4 rounded-xl text-xs font-extrabold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setMobileConfirmSignOut(false);
                              setMobileMenuOpen(false);
                              onLogout();
                            }}
                            className="py-3 px-4 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-md shadow-rose-600/15 cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Theme Mode Quick Switch in Mobile Menu */}
                <div className="flex flex-col items-center gap-2.5 border-t border-slate-200 dark:border-slate-800/60 pt-6 w-full max-w-xs transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
                    Theme Mode
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="flex h-11 w-32 items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
                    title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">{theme}</span>
                    {theme === "light" ? (
                      <Sun className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
                    ) : (
                      <Moon className="h-4.5 w-4.5 text-indigo-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Exact aligned spacer on bottom to balance flex centering */}
              <div className="h-16 shrink-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DarkMoonIcon() {
  return <Moon className="h-4.5 w-4.5 text-indigo-400 fill-indigo-400" />;
}
