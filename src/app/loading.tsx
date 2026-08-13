import * as React from "react";
import { BrandLogo } from "@/components/commerce/brand-logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1D1D1F] text-white font-body select-none">
      <div className="relative flex flex-col items-center gap-6 animate-pulse">
        {/* Glowing Background Glow */}
        <div className="absolute -inset-8 bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/10 to-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

        {/* 999 Store Emblem */}
        <BrandLogo variant="stacked" background="dark" size="lg" />

        {/* Shimmering Progress Bar */}
        <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden relative mt-2">
          <div className="absolute inset-y-0 bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] w-1/2 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
