"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryEntryDialog } from "@/components/commerce/category-entry-dialog";

export function GenderCardsIsland() {
  const router = useRouter();
  const [entryDialogOpen, setEntryDialogOpen] = React.useState(false);
  const [targetCategory, setTargetCategory] = React.useState<"men" | "women">("men");

  const handleOpenCategoryEntry = (category: "men" | "women") => {
    setTargetCategory(category);
    setEntryDialogOpen(true);
  };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {/* Men's Card */}
        <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/3]">
          <img
            src="/sections/men-combo-card.webp"
            alt="Men's Fashion Landing"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-apple)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 sm:p-10 space-y-4">
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-[0.15em] font-ui">Men's Series</span>
            <h3 className="font-heading font-semibold text-3xl sm:text-4xl text-white tracking-tight leading-none">
              Men's Combos
            </h3>
            <p className="text-sm text-white/45 max-w-xs font-ui leading-relaxed">
              Premium shirts, polos, chinos, and exclusive vesti sets.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                className="group/btn inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-white text-[#1D1D1F] font-medium text-sm shadow-[var(--shadow-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-lg)] transition-all cursor-pointer active:scale-95"
                onClick={() => handleOpenCategoryEntry("men")}
              >
                Explore Men's
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Women's Card */}
        <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/3]">
          <img
            src="/sections/women-combo-card.webp"
            alt="Women's Fashion Landing"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-apple)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 sm:p-10 space-y-4">
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-[0.15em] font-ui">Women's Series</span>
            <h3 className="font-heading font-semibold text-3xl sm:text-4xl text-white tracking-tight leading-none">
              Women's Combos
            </h3>
            <p className="text-sm text-white/45 max-w-xs font-ui leading-relaxed">
              Elegant tops, ethnic cotton sets, and premium collections.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                className="group/btn inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-white text-[#1D1D1F] font-medium text-sm shadow-[var(--shadow-md)] hover:scale-[1.02] hover:shadow-[var(--shadow-lg)] transition-all cursor-pointer active:scale-95"
                onClick={() => handleOpenCategoryEntry("women")}
              >
                Explore Women's
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Entry Dialog */}
      <CategoryEntryDialog
        open={entryDialogOpen}
        onOpenChange={setEntryDialogOpen}
        targetCategory={targetCategory}
      />
    </>
  );
}
