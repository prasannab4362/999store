import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-text-secondary">
            Learn how we handle your personal data and ensure transaction safety.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="bg-brand-primary-soft/10 border border-brand-primary/20 rounded-promo p-5 space-y-2">
          <h3 className="font-heading font-extrabold text-base text-brand-primary flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Data Security Guarantee</span>
          </h3>
          <p>
            Your privacy is extremely important to us. We never sell or share customer contact numbers, order histories, or billing addresses with unauthorized third parties. All mock interactions on this V1 app are kept locally on your browser storage.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            1. Information We Collect
          </h3>
          <p>
            We collect only the essential details required to process delivery shipments and verify Cash on Delivery advance payments:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customer Name, Phone number, and Email Address.</li>
            <li>Delivery address details including PIN Code, Landmark, City, and State.</li>
            <li>Transit damage return claims details (text description and video file metadata).</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            2. Local Storage Auditing
          </h3>
          <p>
            To protect your device's memory, we **never store raw video binaries** inside your browser's Local Storage. We only record file descriptors, upload timelines, and file sizes.
          </p>
        </div>
      </div>
    </div>
  );
}
