import { Info, Truck, ShieldAlert, BadgeCheck, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

interface PolicyNoticeProps {
  className?: string;
  variant?: "compact" | "full" | "alert";
}

export function PolicyNotice({ className, variant = "compact" }: PolicyNoticeProps) {
  if (variant === "compact") {
    return (
      <div className={cn("rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-bg-secondary p-4 space-y-2 text-xs text-text-secondary font-body", className)}>
        <div className="flex items-center gap-2 text-text-primary font-bold font-ui uppercase tracking-widest text-[10px]">
          <BadgeCheck className="h-4 w-4" />
          <span>999 Combo Store Policies</span>
        </div>
        <ul className="list-disc pl-4 space-y-1 text-text-secondary font-ui">
          <li>Courier charges are separate from the combo price.</li>
          <li>Cash on Delivery (COD) requires a 20% advance payment.</li>
          <li>No normal exchanges are permitted.</li>
          <li>Damage claims require parcel opening video evidence.</li>
        </ul>
      </div>
    );
  }

  if (variant === "alert") {
    return (
      <div className={cn("rounded-[var(--radius-card)] border border-red-200/60 bg-red-50 p-4 flex gap-3 text-xs text-red-900 font-body", className)}>
        <ShieldAlert className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black font-ui uppercase tracking-widest text-[10px] text-red-700">Critical Return Policy</p>
          <p className="leading-relaxed text-red-800">
            This store operates on a <strong>No Regular Exchange</strong> policy. In the event of transit damage, you <strong>MUST</strong> provide a continuous parcel opening video. Return claims are subject to management approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 md:grid-cols-4 font-body", className)}>
      {[
        {
          icon: Truck,
          iconColor: "text-text-primary",
          title: "Separate Shipping",
          desc: "Courier charges are calculated at checkout and billed separately from the combo price.",
        },
        {
          icon: Info,
          iconColor: "text-text-primary",
          title: "COD 20% Advance",
          desc: "COD orders require a 20% advance payment to prevent fake orders. Pay remaining 80% on delivery.",
        },
        {
          icon: AlertTriangle,
          iconColor: "text-amber-500",
          title: "No Exchange",
          desc: "Since products are sold in highly discounted combo groups, normal item-level exchanges are not supported.",
        },
        {
          icon: ShieldAlert,
          iconColor: "text-red-500",
          title: "Damage Claims",
          desc: "Damaged items require a full unboxing video showing the shipping label. Subject to management review.",
        },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={cn("h-9 w-9 rounded-xl bg-bg-secondary border border-[rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform", )}>
              <Icon className={cn("h-4 w-4", item.iconColor)} />
            </div>
            <h4 className="font-heading font-semibold text-sm text-text-primary uppercase tracking-wide">{item.title}</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-ui">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
