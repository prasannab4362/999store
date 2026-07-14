"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ClipboardList, RotateCcw, UserCheck, ShieldAlert, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionUser, setSessionUser] = React.useState<any | null>(null);

  // Hydrate mock session
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("999-store-session") || "null");
      if (!session) {
        // Create a default demo customer session if none exists
        session = {
          customerId: "cust-999",
          name: "Prasanna B",
          phone: "9876543210",
          email: "prasanna@example.com",
          isDemo: true,
        };
        localStorage.setItem("999-store-session", JSON.stringify(session));
      }
      setSessionUser(session);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("999-store-session");
      toast.success("Demo session cleared!");
      router.push("/");
    }
  };

  const navItems = [
    { href: "/account", label: "Overview", icon: User },
    { href: "/account/orders", label: "My Orders", icon: ClipboardList },
    { href: "/account/returns", label: "Damage Claims", icon: RotateCcw },
    { href: "/account/profile", label: "My Profile", icon: UserCheck },
  ];

  if (!sessionUser) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading account session...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-body">
      <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
        {/* Account navigation Sidebar */}
        <aside className="bg-white border border-border-light rounded-card p-4 space-y-6 shadow-sm self-start">
          <div className="border-b border-border-light pb-4 px-2 space-y-1">
            <span className="text-[10px] text-text-muted font-bold block">WELCOME BACK</span>
            <h3 className="font-heading font-extrabold text-sm text-text-primary truncate">{sessionUser.name}</h3>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-brand-primary-soft text-brand-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
              Demo Client
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-control text-xs font-semibold font-heading transition-colors cursor-pointer",
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-control text-xs font-semibold font-heading text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Clear Demo Session</span>
            </button>
          </nav>
        </aside>

        {/* Content body */}
        <div className="bg-white border border-border-light rounded-card p-6 shadow-sm min-h-[50vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
