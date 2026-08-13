"use client";

import * as React from "react";
import { comboConfigs } from "@/config/combo";
import { Layers, Sparkles, Check, Lock } from "lucide-react";

export default function AdminCombosPage() {
  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight uppercase">
          Combo Tier Configurations
        </h1>
        <p className="text-xs sm:text-sm text-white/50 font-ui mt-1">
          Flat ₹999 Base Rate Engine package configurations and tier settings.
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {comboConfigs.map((config) => (
          <div key={config.id} className="rounded-3xl border border-white/10 bg-[#161618] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold uppercase tracking-wider">
                {config.badge}
              </span>
              <span className="text-xs font-bold text-white/40 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" /> Locked Base Price
              </span>
            </div>

            <div>
              <h3 className="font-heading font-black text-2xl text-white tracking-tight">{config.name}</h3>
              <p className="text-xs text-white/50 font-ui mt-1">{config.itemLimit} Included Dress Slots</p>
            </div>

            <div className="flex items-baseline gap-2 py-1">
              <span className="text-3xl font-black font-heading text-amber-400">₹999</span>
              <span className="text-xs text-white/40 font-medium uppercase">Flat Rate</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-ui">{config.description}</p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Active Storefront Tier
              </span>
              <span className="text-white/40">Tier ID: {config.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
