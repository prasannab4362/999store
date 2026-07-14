import Link from "next/link";
import { ShieldAlert, Video, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DamageReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Damage & Return Claims
          </h1>
          <p className="text-xs text-text-secondary">
            Read details about our strict unboxing video requirements and damage return rules.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        {/* Core Warning */}
        <div className="bg-red-50 border border-red-200 rounded-promo p-5 space-y-3 text-red-900">
          <h3 className="font-heading font-extrabold text-base text-red-800 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Strict No Regular Exchange Policy</span>
          </h3>
          <p>
            Because we offer fashion products at highly discounted rates in combo packs, we **do not accept regular color or size exchanges** after delivery. Please review size guides carefully before ordering. We only accept returns/refunds for **transit-damaged** items.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Video className="h-4.5 w-4.5 text-brand-primary" />
            <span>Unboxing Video Guide</span>
          </h3>
          <p>
            To file a transit damage claim, you **MUST provide a continuous, single-shot parcel opening video** that clearly displays:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The parcel showing our company packaging label and your address details legible.</li>
            <li>No cuts, edits, fast-forwards, or pause-and-resumes in the video.</li>
            <li>The unpacking of the items, revealing the fabric/sewing damage directly.</li>
          </ul>
          <p className="text-xs text-text-muted">
            *Claims submitted without a valid unboxing video will be rejected immediately by our auditing staff.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            1. Auditing & Claims Approval
          </h3>
          <p>
            Once a claim is submitted in the account dashboard, it is audited within 24-48 hours. If approved, we will either initiate a partial refund to your bank or dispatch a replacement item depending on item stock availability.
          </p>
        </div>

        <div className="flex justify-start pt-4">
          <Button size="lg" asChild className="gap-2 cursor-pointer font-bold font-heading">
            <Link href="/account/returns/new">
              <span>File Damage Claim Now</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
