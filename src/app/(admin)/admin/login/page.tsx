"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/auth/supabase-auth";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@999store.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Check configured admin master credentials first (e.g. admin@999.com / 123456)
      if ((email.trim().toLowerCase() === "admin@999.com" || email.trim().toLowerCase() === "admin@999store.com") && password === "123456") {
        if (typeof window !== "undefined") {
          localStorage.setItem("999-admin-session", JSON.stringify({ email: email.trim(), role: "ADMIN", timestamp: Date.now() }));
        }
        toast.success("Welcome Admin!");
        router.push("/admin");
        return;
      }

      // Try Supabase auth
      const result = await signInWithEmail(email, password);
      const user = result?.user;
      if (user && typeof window !== "undefined") {
        localStorage.setItem("999-admin-session", JSON.stringify({ email: user.email, role: "ADMIN", timestamp: Date.now() }));
      }

      toast.success("Welcome, Admin!");
      router.push("/admin");
    } catch (err: any) {
      // If Supabase fails but password matches master fallback
      if (password === "123456" && (email.toLowerCase().includes("admin") || email.toLowerCase().includes("999"))) {
        if (typeof window !== "undefined") {
          localStorage.setItem("999-admin-session", JSON.stringify({ email: email.trim(), role: "ADMIN", timestamp: Date.now() }));
        }
        toast.success("Welcome, Admin!");
        router.push("/admin");
        return;
      }

      const msg = err?.message ?? "";
      if (msg.toLowerCase().includes("invalid login") || msg.toLowerCase().includes("credentials")) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center px-4 font-body">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo / Brand */}
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20">
            <ShieldCheck className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-white/40 text-xs font-ui">
            999 Combo Store · Secure Admin Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  id="admin-email"
                  placeholder="admin@999store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition-all font-ui"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-12 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition-all font-ui"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? "Signing In..." : "Access Admin Portal"}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Back to store */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <a
              href="/"
              className="text-xs text-white/30 hover:text-white/60 transition-colors font-ui cursor-pointer"
            >
              ← Back to 999 Combo Store
            </a>
          </div>
        </div>

        <p className="text-center text-white/15 text-[10px] font-ui">
          This area is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
