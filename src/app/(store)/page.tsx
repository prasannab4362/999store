"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, Video, Play, CreditCard, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { comboConfigs } from "@/config/combo";
import { categories } from "@/data/mock/categories";
import { mockHomeReviews } from "@/data/mock/reviews";
import { homeHeroBanner } from "@/data/mock/banners";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { useComboStore } from "@/stores/combo-store";
import { useRouter } from "next/navigation";
import { getPlaceholderSvg } from "@/lib/utils/placeholders";

export default function HomePage() {
  const router = useRouter();
  const startCombo = useComboStore((state) => state.startCombo);

  const handleStartCombo = (config: any) => {
    startCombo(config);
    router.push(`/combo/${config.slug}`);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative bg-bg-secondary py-12 md:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 items-center gap-12 relative z-10">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-primary-soft text-brand-primary text-[10px] font-extrabold font-heading uppercase tracking-widest">
              MIX. MATCH. MAKE IT 999.
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-text-primary tracking-tight leading-tight uppercase">
              BUILD YOUR COMBO. <br />
              <span className="text-brand-primary">MAKE IT YOURS.</span> <br />
              <span className="text-brand-accent">ALL AT ₹999.</span>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto md:mx-0">
              Pick your combo size. Mix Men's and Women's styles. Choose your colours and sizes. Complete your combo for ₹999.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Button size="lg" onClick={() => router.push("/combo")} className="w-full sm:w-auto font-heading font-bold uppercase tracking-wide cursor-pointer">
                {homeHeroBanner.ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/products")} className="w-full sm:w-auto font-heading font-bold uppercase tracking-wide cursor-pointer">
                EXPLORE STYLES
              </Button>
            </div>
            <p className="text-[11px] text-text-muted font-heading uppercase tracking-wider">
              *Courier charges are calculated separately at checkout. COD requires a 20% advance payment.
            </p>
          </div>
          <div className="relative aspect-[3/4] max-w-sm w-full justify-self-center md:justify-self-end rounded-promo overflow-hidden shadow-lg border border-border-light bg-white">
            <Image
              src={homeHeroBanner.image}
              alt="Build Your Own Fashion Combo Showcase"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* 2. Combo Selector */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            HOW MANY ARE YOU PICKING?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Pick your pack size. Mix and match any Men's and Women's items. Base price is flat ₹999 for all combo tiers!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {comboConfigs.map((config) => (
            <div
              key={config.id}
              className="rounded-card border border-border-light bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="space-y-4">
                <span className={`inline-block text-[9px] font-bold font-heading px-2 py-0.5 rounded-full ${config.themeMetadata?.bgClass} ${config.themeMetadata?.colorClass}`}>
                  {config.badge}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-primary">{config.name}</h3>
                  <p className="text-[10px] text-text-muted">{config.itemLimit} Selected Items</p>
                </div>
                <div className="flex items-baseline gap-1.5 py-1">
                  <span className="text-2xl font-bold font-heading text-brand-primary">₹999</span>
                  <span className="text-[10px] text-text-muted line-through">₹2,499</span>
                </div>
                <p className="text-xs text-text-secondary leading-normal">{config.description}</p>
              </div>

              <Button
                variant="secondary"
                className="mt-6 w-full group-hover:bg-brand-primary group-hover:text-white transition-colors"
                onClick={() => handleStartCombo(config)}
              >
                Start Building
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why Shop With Us (reusable policies) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            WHY SHOP WITH US
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            We believe in complete policy transparency. Read our simple rules before placing an order.
          </p>
        </div>
        <PolicyNotice variant="full" />
      </section>

      {/* 4. Mix & Match Editorial Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 rounded-promo bg-brand-primary-soft p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center border border-brand-primary/10">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            THE MIX & MATCH FREEDOM
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Unlike standard stores, we don't lock you into a single gender or product category. Want to pick 3 Shirts for yourself, 2 Kurtas for your partner, and 5 trackpants for college? <br />
            <strong>Go right ahead!</strong> Put them all in the same combo, select their sizes/colors individually, and pay a single base price.
          </p>
          <div className="grid grid-cols-5 gap-3">
            {[
              { num: "01", text: "Choose Combo" },
              { num: "02", text: "Explore Fashion" },
              { num: "03", text: "Select Size/Color" },
              { num: "04", text: "Review Combo" },
              { num: "05", text: "Secure Checkout" },
            ].map((step, idx) => (
              <div key={idx} className="text-center space-y-1">
                <span className="block font-heading font-extrabold text-brand-primary text-sm sm:text-base">{step.num}</span>
                <span className="block text-[8px] sm:text-[9px] font-bold text-text-secondary leading-tight">{step.text}</span>
              </div>
            ))}
          </div>
          <Button size="lg" onClick={() => router.push("/combo")}>
            BUILD A MIX COMBO
          </Button>
        </div>
        {/* Mix & Match Visual Guide — Normalized WebP Showcase */}
        <div className="relative aspect-video rounded-card overflow-hidden border border-border-light shadow-sm bg-white">
          <Image
            src="/sections/mix-match-guide.webp"
            alt="Mix and Match Step-by-Step illustration"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </section>

      {/* 5. Shop Category Men/Women */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border-light pb-4">
          <h2 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            SHOP BY GENDER
          </h2>
          <p className="text-xs text-text-secondary">
            Pick your catalog to explore, or start mixing in the Combo Builder!
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Men's landing card — styled panel with normalized campaign image */}
          <div className="group relative rounded-promo overflow-hidden aspect-[16/10] border border-border-light shadow-sm">
            <Image
              src="/sections/men-combo-card.webp"
              alt="Men's Fashion Landing"
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 space-y-3">
              <span className="inline-block text-[9px] font-bold font-heading bg-brand-primary text-white px-2 py-0.5 rounded-full w-max">
                MEN'S SERIES
              </span>
              <h3 className="font-heading font-extrabold text-xl text-white">MEN'S COMBOS</h3>
              <p className="text-xs text-gray-300 max-w-sm">Explore shirts, polos, chinos, and wedding vesti sets.</p>
              <div className="flex gap-3">
                <Button size="sm" asChild><Link href="/men">Explore Men's</Link></Button>
                <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white" onClick={() => router.push("/combo/5-items")}>
                  Build Men Combo
                </Button>
              </div>
            </div>
          </div>

          {/* Women's landing card — styled panel with normalized campaign image */}
          <div className="group relative rounded-promo overflow-hidden aspect-[16/10] border border-border-light shadow-sm">
            <Image
              src="/sections/women-combo-card.webp"
              alt="Women's Fashion Landing"
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 space-y-3">
              <span className="inline-block text-[9px] font-bold font-heading bg-brand-accent text-white px-2 py-0.5 rounded-full w-max">
                WOMEN'S SERIES
              </span>
              <h3 className="font-heading font-extrabold text-xl text-white">WOMEN'S COMBOS</h3>
              <p className="text-xs text-gray-300 max-w-sm">Explore tops, crop tees, ethnic cotton sets, and lehengas.</p>
              <div className="flex gap-3">
                <Button size="sm" asChild><Link href="/women">Explore Women's</Link></Button>
                <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white" onClick={() => router.push("/combo/5-items")}>
                  Build Women Combo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 6. Customer Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 bg-bg-secondary py-12 rounded-promo border border-border-light">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Read verified reviews from customers who purchased combo packs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mockHomeReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-card border border-border-light shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border-light pt-3 text-[10px] text-text-muted">
                <span className="font-heading font-semibold text-text-primary">{review.customerName}</span>
                <span className="bg-brand-primary-soft text-brand-primary px-2 py-0.5 rounded-full font-semibold">{review.comboPurchased}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
