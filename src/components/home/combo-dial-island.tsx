"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { comboConfigs } from "@/config/combo";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function ComboDial() {
  const router = useRouter();
  const startCombo = useComboStore((state) => state.startCombo);
  const { activeCombo, selectedCount, remainingCount, isComplete } = useActiveComboDetails();

  const [selectedDialId, setSelectedDialId] = React.useState<string>(
    activeCombo?.comboId || "combo-3"
  );

  React.useEffect(() => {
    if (activeCombo?.comboId) {
      setSelectedDialId(activeCombo.comboId);
    }
  }, [activeCombo?.comboId]);

  const currentConfig = comboConfigs.find((c) => c.id === selectedDialId) || comboConfigs[1];

  const isActiveComboCurrent = activeCombo?.comboId === currentConfig.id;

  const handleStartCombo = (config: typeof comboConfigs[0]) => {
    startCombo(config);
    // Smooth scroll to catalog section instead of hard navigation
    const catalogSection = document.getElementById("catalog-section") || document.getElementById("how-it-works-video");
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const progressPercent = activeCombo
    ? Math.round((selectedCount / activeCombo.itemLimit) * 100)
    : 0;

  return (
    <div
      id="combo-dial-container"
      className={cn(
        "max-w-2xl mx-auto bg-[#1D1D1F] rounded-3xl p-8 sm:p-12 shadow-[var(--shadow-xl)] text-center space-y-10 border transition-all duration-500",
        activeCombo ? "border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.15)]" : "border-white/10"
      )}
    >
      {/* Tier selector — segmented control */}
      <div className="w-full max-w-xs sm:max-w-md mx-auto grid grid-cols-5 bg-white/10 rounded-full p-1 gap-1 select-none">
        {comboConfigs.map((config) => {
          const isActive = selectedDialId === config.id;
          const isConfigActiveCombo = activeCombo?.comboId === config.id;

          return (
            <button
              key={config.id}
              onClick={() => setSelectedDialId(config.id)}
              className={cn(
                "relative text-xs sm:text-sm font-bold font-heading h-9 sm:h-10 px-1 sm:px-3 rounded-full transition-all cursor-pointer flex items-center justify-center z-10 gap-1",
                isActive
                  ? "text-[#1D1D1F]"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="combo-dial-active"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{config.itemLimit.toString().padStart(2, "0")}</span>
              {isConfigActiveCombo && (
                <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Combo detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentConfig.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block text-[11px] font-semibold font-ui tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-white/8 text-white/50">
                {currentConfig.badge}
              </span>
              {isActiveComboCurrent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-ui tracking-[0.1em] uppercase px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm animate-pulse">
                  <Sparkles className="h-3 w-3" /> ACTIVE COMBO
                </span>
              )}
            </div>

            <h3 className="font-heading font-semibold text-3xl sm:text-4xl text-white tracking-tight">
              {currentConfig.itemLimit} Picks Combo
            </h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto font-ui leading-relaxed">
              {currentConfig.description}
            </p>
          </div>

          {/* VISUAL PROGRESS INDICATOR (If active combo) */}
          {isActiveComboCurrent && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs font-ui">
                <span className="text-white/70 font-medium">
                  {selectedCount} of {activeCombo.itemLimit} slots filled
                </span>
                <span className="font-semibold text-[#D4AF37] tabular-nums">
                  {isComplete ? "✅ Combo Complete!" : `${remainingCount} item${remainingCount === 1 ? "" : "s"} left`}
                </span>
              </div>
              {/* Visual Progress Bar */}
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    isComplete
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                      : "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  )}
                />
              </div>
            </div>
          )}

          <div className="border-t border-white/8 pt-6 space-y-5 max-w-xs mx-auto">
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-4xl font-semibold font-heading text-[#D4AF37] tracking-tight">₹999</span>
              <span className="text-xs text-white/35 font-medium font-ui uppercase tracking-wide">Flat Price</span>
            </div>

            <button
              onClick={() => handleStartCombo(currentConfig)}
              className={cn(
                "w-full h-12 rounded-full font-medium text-sm transition-all cursor-pointer active:scale-95 group flex items-center justify-center gap-2",
                isActiveComboCurrent
                  ? "bg-[#D4AF37] text-[#1D1D1F] font-semibold hover:bg-[#E5C158] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "bg-white text-[#1D1D1F] hover:scale-[1.02] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
              )}
            >
              {isActiveComboCurrent ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#1D1D1F]" />
                  <span>Selected & Active</span>
                </>
              ) : (
                <>
                  <span>Select This Combo</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
