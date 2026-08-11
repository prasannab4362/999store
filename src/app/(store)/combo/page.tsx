"use client";

import { useRouter } from "next/navigation";
import { comboConfigs } from "@/config/combo";
import { Button } from "@/components/ui/button";
import { useComboStore } from "@/stores/combo-store";
import { toast } from "sonner";

export default function ComboSelectionPage() {
  const router = useRouter();
  const startCombo = useComboStore((state) => state.startCombo);

  const handleStart = (config: any) => {
    startCombo(config);
    toast.success(`Started building your ${config.name}!`);
    router.push(`/combo/${config.slug}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 font-body">
      <div className="text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
          Build Your Own Combo
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Select your combo size from the tiers below. You can mix and match Men's and Women's fashion items inside the same combo! Base price is flat **₹999** for all sizes.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {comboConfigs.map((config) => (
          <div
            key={config.id}
            className="rounded-card border border-border-light bg-white p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="space-y-4">
              <span className={`inline-block text-[10px] font-bold font-heading px-3 py-1 rounded-full ${config.themeMetadata?.bgClass} ${config.themeMetadata?.colorClass}`}>
                {config.badge}
              </span>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-text-primary">{config.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{config.itemLimit} Selected Slots</p>
              </div>
              <div className="flex items-baseline gap-2 py-1">
                <span className="text-3xl font-extrabold font-heading text-brand-primary">₹999</span>
                <span className="text-sm text-text-muted line-through">₹2,499</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{config.description}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button
                size="sm"
                className="w-full font-bold uppercase text-[11px] tracking-wider cursor-pointer"
                onClick={() => {
                  startCombo(config, "men");
                  toast.success(`Started ${config.name} for Men!`);
                  router.push("/products?gender=men");
                }}
              >
                Men's
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full font-bold uppercase text-[11px] tracking-wider border-brand-accent text-brand-accent hover:bg-brand-accent/10 cursor-pointer"
                onClick={() => {
                  startCombo(config, "women");
                  toast.success(`Started ${config.name} for Women!`);
                  router.push("/products?gender=women");
                }}
              >
                Women's
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
