"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function ViewAllButton({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer group"
    >
      {label}
      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

export function MixMatchCTAButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/combo")}
      className="group inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-white text-[#1D1D1F] font-medium text-sm shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all cursor-pointer active:scale-95"
    >
      Build A Mix Combo
      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
