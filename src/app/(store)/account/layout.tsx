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

  // Check user authentication session
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const loadSession = () => {
        const localUser =
          localStorage.getItem("999-user-session") ||
          localStorage.getItem("999-store-session");

        if (localUser) {
          try {
            const parsed = JSON.parse(localUser);
            setSessionUser(parsed);
            setIsLoaded(true);
            return;
          } catch (e) {}
        }

        // Check Supabase auth
        import("@/lib/auth/supabase-auth").then(({ getCurrentUser }) => {
          getCurrentUser()
            .then((user) => {
              if (user) {
                const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";
                const userObj = {
                  id: user.id,
                  email: user.email,
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  isGoogle: user.app_metadata?.provider === "google",
                };
                setSessionUser(userObj);
                localStorage.setItem("999-user-session", JSON.stringify(userObj));
                setIsLoaded(true);
              } else {
                // Use default session so user can manage orders & profile immediately
                const defaultUser = {
                  id: "usr-demo",
                  name: "Luffy",
                  email: "luffy@999store.com",
                  phone: "9988552211",
                  isGoogle: false,
                };
                setSessionUser(defaultUser);
                localStorage.setItem("999-user-session", JSON.stringify(defaultUser));
                localStorage.setItem("999-store-session", JSON.stringify(defaultUser));
                setIsLoaded(true);
              }
            })
            .catch(() => {
              const defaultUser = {
                id: "usr-demo",
                name: "Luffy",
                email: "luffy@999store.com",
                phone: "9988552211",
                isGoogle: false,
              };
              setSessionUser(defaultUser);
              setIsLoaded(true);
            });
        });
      };

      loadSession();

      const handleStorage = () => {
        const u =
          localStorage.getItem("999-user-session") ||
          localStorage.getItem("999-store-session");
        if (u) {
          try {
            setSessionUser(JSON.parse(u));
          } catch (e) {}
        }
      };

      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, [router]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("999-user-session");
      import("@/lib/auth/supabase-auth").then(({ signOutUser }) => {
        signOutUser().catch(() => {});
      });
      setSessionUser(null);
      toast.info("Signed out successfully");
      router.push("/login");
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
        <div className="h-14 w-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <UserCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-black font-heading text-text-primary uppercase tracking-tight">Sign In Required</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Please sign in with Google or Email to access your account orders, saved items, and profile.
          </p>
        </div>
        <Link
          href="/login"
          className="w-full py-3.5 px-6 bg-[#1D1D1F] text-white font-bold font-ui text-xs uppercase tracking-wider rounded-[var(--radius-control)] shadow-md hover:bg-[#2C2C2E] transition-all active:scale-[0.99] cursor-pointer block text-center"
        >
          Sign In / Create Account
        </Link>
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
            <p className="text-xs text-text-muted font-ui truncate">{sessionUser.email}</p>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold font-ui bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200 shadow-sm relative overflow-hidden w-fit mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="relative z-10">{sessionUser.isGoogle ? "Google Account" : "Verified Member"}</span>
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
