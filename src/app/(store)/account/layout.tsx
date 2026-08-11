"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ClipboardList, RotateCcw, UserCheck, ShieldAlert, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

import { DEFAULT_DEMO_SESSION } from "@/data/mock/user";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = React.useState<any | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Hydrate mock session or set default
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("999-store-session") || "null");
      if (!session) {
        session = DEFAULT_DEMO_SESSION;
        localStorage.setItem("999-store-session", JSON.stringify(DEFAULT_DEMO_SESSION));
      }
      setSessionUser(session);
      setIsLoaded(true);
    }
  }, []);

  const restoreSession = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("999-store-session", JSON.stringify(DEFAULT_DEMO_SESSION));
      setSessionUser(DEFAULT_DEMO_SESSION);
      toast.success("Demo session restored!");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("999-store-session");
      setSessionUser(null);
      toast.info("Demo session cleared");
    }
  };

  const navItems = [
    { href: "/account", label: "Overview", icon: User },
    { href: "/account/orders", label: "My Orders", icon: ClipboardList },
    { href: "/account/returns", label: "Damage Claims", icon: RotateCcw },
    { href: "/account/profile", label: "My Profile", icon: UserCheck },
  ];

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-xs font-ui font-bold uppercase tracking-widest text-text-muted animate-pulse">Loading account session...</p>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="mx-auto max-w-md text-center py-16 px-6 font-body min-h-[60vh] flex flex-col items-center justify-center space-y-5 bg-white border border-border-medium/40 rounded-[var(--radius-card)] shadow-sm my-10">
        <div className="h-14 w-14 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center">
          <UserCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-black font-heading text-text-primary uppercase tracking-tight">Demo Session Cleared</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your demo account session was removed. Click below to restore the demo session and access your account.
          </p>
        </div>
        <button
          onClick={restoreSession}
          className="w-full py-3.5 px-6 bg-brand-primary text-white font-bold font-ui text-xs uppercase tracking-wider rounded-[var(--radius-control)] shadow-md hover:bg-brand-primary-dark transition-all active:scale-[0.99] cursor-pointer"
        >
          Restore Demo Session
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-body min-h-[75vh]">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8 xl:gap-12 items-start">
        {/* Account navigation Sidebar */}
        <aside className="bg-white border border-border-medium/40 rounded-[var(--radius-card)] p-5 space-y-6 shadow-[var(--shadow-md)] self-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-primary-light" />
          
          <div className="border-b border-border-medium/40 pb-5 px-1 space-y-2">
            <span className="text-[10px] text-text-muted font-bold font-ui uppercase tracking-widest block">Welcome Back</span>
            <h3 className="font-heading font-black text-xl text-text-primary truncate tracking-tight">{sessionUser.name}</h3>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold font-ui bg-brand-primary-soft text-brand-primary px-3 py-1 rounded-full uppercase tracking-widest border border-brand-primary/10 shadow-sm relative overflow-hidden">
              <span className="absolute inset-0 bg-brand-primary/10 animate-pulse" />
              <span className="relative z-10">Demo Client</span>
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-control)] text-xs font-bold font-ui uppercase tracking-wider transition-all duration-200 cursor-pointer border",
                    isActive
                      ? "bg-brand-primary text-white border-brand-primary shadow-md translate-x-1"
                      : "text-text-secondary border-transparent hover:bg-bg-secondary hover:text-text-primary hover:border-border-medium/20"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-70")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-border-medium/40">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-control)] text-xs font-bold font-ui uppercase tracking-wider text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer text-left group"
              >
                <LogOut className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Clear Demo Session</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Content body */}
        <div className="bg-white border border-border-medium/40 rounded-[var(--radius-card)] p-6 sm:p-8 shadow-[var(--shadow-md)] min-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
