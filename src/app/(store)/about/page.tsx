import Link from "next/link";
import { Sparkles, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 font-body">
      <div className="text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
          About 999 Combo Store
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          India's first dedicated Mix & Match fashion combo store. We are redefining how you buy clothes.
        </p>
      </div>

      <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
        <div className="grid sm:grid-cols-2 gap-8 items-center bg-bg-secondary p-6 rounded-promo border border-border-light">
          <div className="space-y-4">
            <h3 className="font-heading font-extrabold text-lg text-text-primary">Our Core Concept</h3>
            <p>
              Why should you pay high retail prices for individual clothing garments? At 999 Combo Store, we sell clothes in curated combo packs.
            </p>
            <p>
              Mix and match Men's Shirts, Polos, Women's Crop Tops, Lehenga, or Ethnic Cotton Sets all within a single combo group for a flat rate of **₹999**.
            </p>
          </div>
          <div className="relative aspect-video rounded-card bg-white border border-border-light flex items-center justify-center font-heading font-extrabold text-2xl text-brand-primary">
            Flat ₹999 Tiers
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            Our Business Principles
          </h3>
          <p>
            We operate with absolute transparency and policy safety. Our COD 20% advance checks and strict unboxing video requirements for returns allow us to keep operations lean, passing savings directly to you.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/combo" passHref legacyBehavior>
            <Button size="lg" className="gap-2 cursor-pointer font-bold font-heading">
              <span>Start Building a Combo</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
