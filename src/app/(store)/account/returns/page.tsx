"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AccountReturnsPage() {
  const [claims, setClaims] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setClaims(JSON.parse(localStorage.getItem("999-store-claims") || "[]"));
    }
  }, []);

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
            DAMAGE RETURN CLAIMS
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your unboxing-related transit damage claims.
          </p>
        </div>

        <Link href="/account/returns/new" passHref legacyBehavior>
          <Button size="sm" className="h-9 cursor-pointer">File New Claim</Button>
        </Link>
      </div>

      {claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="border border-border-light rounded-promo p-5 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-text-primary">
                    Claim ID: {claim.id}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>Order: <strong>{claim.orderId}</strong></p>
                <p>Reason: <span className="italic">"{claim.reason}"</span></p>
                <p className="text-[10px] text-text-muted">Video attachment: {claim.videoFile.name}</p>
              </div>

              <div className="flex flex-col items-baseline sm:items-end justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-light">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-heading uppercase tracking-wide",
                    {
                      "bg-amber-50 text-amber-800 border border-amber-200": claim.status === "submitted" || claim.status === "under_review",
                      "bg-emerald-50 text-emerald-800 border border-emerald-200": claim.status === "approved" || claim.status === "resolved",
                      "bg-red-50 text-red-800 border border-red-200": claim.status === "rejected",
                    }
                  )}
                >
                  {claim.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-promo border border-dashed border-border-medium p-12 text-center space-y-4 max-w-sm mx-auto">
          <RotateCcw className="h-10 w-10 text-text-muted mx-auto" />
          <h3 className="font-heading font-bold text-base text-text-primary">No claims filed</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Did you receive a damaged package? File a transit damage claim here with unboxing video evidence.
          </p>
          <Link href="/account/returns/new" passHref legacyBehavior>
            <Button className="w-full cursor-pointer">File Damage Claim</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
