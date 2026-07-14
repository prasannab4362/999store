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
      <div className={cn("rounded-card border border-border-light bg-bg-secondary p-4 space-y-2 text-xs text-text-secondary font-body", className)}>
        <div className="flex items-center gap-2 text-brand-primary font-semibold font-heading">
          <BadgeCheck className="h-4.5 w-4.5" />
          <span>999 Combo Store Policies</span>
        </div>
        <ul className="list-disc pl-4 space-y-1">
          <li>Courier charges are separate.</li>
          <li>Cash on Delivery (COD) requires a 20% advance payment.</li>
          <li>No normal exchanges are permitted.</li>
          <li>Damage claims require parcel opening video evidence.</li>
        </ul>
      </div>
    );
  }

  if (variant === "alert") {
    return (
      <div className={cn("rounded-card border border-red-200 bg-red-50 p-4 flex gap-3 text-xs text-red-900 font-body", className)}>
        <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
        <div className="space-y-1">
          <p className="font-semibold font-heading text-red-800">Critical Store Return Policy</p>
          <p>This store operates on a **No Regular Exchange** policy. In the event of transit damage, you **MUST** provide a continuous parcel opening video. Return claims are subject to management approval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 md:grid-cols-4 font-body", className)}>
      <div className="rounded-card border border-border-light bg-white p-5 space-y-2">
        <Truck className="h-6 w-6 text-brand-primary" />
        <h4 className="font-heading font-semibold text-sm text-text-primary">Separate Shipping</h4>
        <p className="text-xs text-text-secondary leading-relaxed">Courier charges are calculated at checkout and billed separately from the combo price.</p>
      </div>

      <div className="rounded-card border border-border-light bg-white p-5 space-y-2">
        <Info className="h-6 w-6 text-brand-primary" />
        <h4 className="font-heading font-semibold text-sm text-text-primary">COD 20% Advance</h4>
        <p className="text-xs text-text-secondary leading-relaxed">COD orders require a 20% advance payment to prevent fake orders. Pay the remaining 80% on delivery.</p>
      </div>

      <div className="rounded-card border border-border-light bg-white p-5 space-y-2">
        <AlertTriangle className="h-6 w-6 text-amber-600" />
        <h4 className="font-heading font-semibold text-sm text-text-primary">No Exchange</h4>
        <p className="text-xs text-text-secondary leading-relaxed">Since products are sold in highly discounted combo groups, normal item-level exchanges are not supported.</p>
      </div>

      <div className="rounded-card border border-border-light bg-white p-5 space-y-2">
        <ShieldAlert className="h-6 w-6 text-red-600" />
        <h4 className="font-heading font-semibold text-sm text-text-primary">Damage Claims</h4>
        <p className="text-xs text-text-secondary leading-relaxed">Damaged items require a full unboxing video showing the shipping label. Subject to management review.</p>
      </div>
    </div>
  );
}
