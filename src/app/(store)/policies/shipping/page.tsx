import Link from "next/link";
import { Truck, ShieldCheck, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Shipping & Dispatch Policy
          </h1>
          <p className="text-xs text-text-secondary">
            Read details about shipping charges, dispatch timelines, and delivery coverage.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        {/* Core Rule */}
        <div className="bg-brand-primary-soft/10 border border-brand-primary/20 rounded-promo p-5 space-y-3">
          <h3 className="font-heading font-extrabold text-base text-brand-primary flex items-center gap-2">
            <Truck className="h-5 w-5" />
            <span>Shipping Charge Separation</span>
          </h3>
          <p>
            Please note that our store base price of **₹999** covers only the cost of clothing garments selected in a combo pack. **Courier charges are calculated dynamically at checkout** based on package weight and shipping location, and are billed separately.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            1. Delivery Timelines
          </h3>
          <p>
            We process orders daily from our regional warehouse center. Orders placed before 2:00 PM are dispatched on the same business day. Delivery usually takes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Metro Cities: 2 - 4 business days.</li>
            <li>Rest of India: 4 - 7 business days.</li>
            <li>North-East / J&K: 5 - 9 business days.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            2. Logistics Partners
          </h3>
          <p>
            We partner with reliable third-party shipping solutions like Delhivery, BlueDart, XpressBees, and DTDC to ensure that your combo items arrive intact and on schedule. Once dispatched, you will receive a tracking link via SMS/Email.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            3. Address Corrections
          </h3>
          <p>
            Please check your PIN Code, street address, and phone number carefully before placing order. Address corrections requested after dispatch may incur additional re-routing charges.
          </p>
        </div>
      </div>
    </div>
  );
}
