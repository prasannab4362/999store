"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Gift, CheckCircle2, ShoppingBag, Zap } from "lucide-react";
import { useActiveComboDetails } from "@/stores/combo-store";

export interface PromoNotification {
  id: string;
  type: "combo_selected" | "item_added" | "almost_complete" | "gift_unlocked" | "completed";
  icon: any;
  title: string;
  message: string;
  color: string;
}

export function PromoToast() {
  const { activeCombo, selectedCount, remainingCount, isComplete } = useActiveComboDetails();
  const [notification, setNotification] = React.useState<PromoNotification | null>(null);

  const prevComboIdRef = React.useRef<string | null>(null);
  const prevCountRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!activeCombo) {
      prevComboIdRef.current = null;
      prevCountRef.current = 0;
      setNotification(null);
      return;
    }

    const currentComboId = activeCombo.comboId;
    const isNewCombo = prevComboIdRef.current !== currentComboId;
    const isItemAdded = selectedCount > prevCountRef.current && !isNewCombo;

    prevComboIdRef.current = currentComboId;
    prevCountRef.current = selectedCount;

    // 1. Event: Combo Selected
    if (isNewCombo) {
      setNotification({
        id: `toast-${Date.now()}`,
        type: "combo_selected",
        icon: Sparkles,
        title: "Active Combo Selected!",
        message: `🎉 ${activeCombo.comboName} activated! Select any ${activeCombo.itemLimit} styles for a flat ₹999 rate.`,
        color: "from-[#D4AF37] to-[#A67C1E]",
      });
      return;
    }

    // 2. Event: Combo Complete
    if (isComplete) {
      setNotification({
        id: `toast-${Date.now()}`,
        type: "completed",
        icon: CheckCircle2,
        title: "Combo Complete!",
        message: "✅ You've filled all slots. Ready to review and checkout for flat ₹999!",
        color: "from-emerald-500 to-teal-700",
      });
      return;
    }

    // 3. Event: Free Gift Unlocked (e.g. at 5+ items or combo tier > 3)
    if (isItemAdded && selectedCount === 3 && activeCombo.itemLimit >= 5) {
      setNotification({
        id: `toast-${Date.now()}`,
        type: "gift_unlocked",
        icon: Gift,
        title: "Reward Unlocked!",
        message: "🎁 Congratulations! Free Premium Velvet Style Pouch unlocked with your combo!",
        color: "from-amber-400 to-[#D4AF37]",
      });
      return;
    }

    // 4. Event: Almost Complete (1 slot left)
    if (isItemAdded && remainingCount === 1) {
      setNotification({
        id: `toast-${Date.now()}`,
        type: "almost_complete",
        icon: Zap,
        title: "Almost Complete!",
        message: "⚡ Only 1 item left to finish your combo set!",
        color: "from-purple-600 to-indigo-700",
      });
      return;
    }

    // 5. Event: Product Added
    if (isItemAdded) {
      setNotification({
        id: `toast-${Date.now()}`,
        type: "item_added",
        icon: ShoppingBag,
        title: "Style Added!",
        message: `🛍️ ${selectedCount} of ${activeCombo.itemLimit} items selected (${remainingCount} slot${remainingCount === 1 ? "" : "s"} left).`,
        color: "from-[#1D1D1F] to-[#3A3A3C]",
      });
    }
  }, [activeCombo, selectedCount, remainingCount, isComplete]);

  // Auto-hide notification after 5 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  const Icon = notification.icon;

  return (
    <AnimatePresence>
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 max-w-sm w-[92vw] sm:w-80 font-body pointer-events-auto select-none"
      >
        <div className="relative rounded-2xl bg-[#1D1D1F]/95 backdrop-blur-xl border border-white/15 text-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-start gap-3.5 overflow-hidden group">
          {/* Accent glow strip */}
          <div className={`absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b ${notification.color}`} />

          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#D4AF37] shadow-inner mt-0.5">
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0 pr-4 space-y-0.5">
            <h5 className="font-heading font-semibold text-xs text-white tracking-tight uppercase">
              {notification.title}
            </h5>
            <p className="text-[12px] text-white/70 font-ui leading-normal">
              {notification.message}
            </p>
          </div>

          <button
            onClick={() => setNotification(null)}
            className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
