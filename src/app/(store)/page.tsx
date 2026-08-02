"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, Video, Play, CreditCard, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { comboConfigs } from "@/config/combo";
import { categories } from "@/data/mock/categories";
import { mockHomeReviews } from "@/data/mock/reviews";
import { homeHeroBanner } from "@/data/mock/banners";
import { products } from "@/data/mock/products";
import { ProductCard } from "@/components/commerce/product-card";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { useRouter } from "next/navigation";
import { getPlaceholderSvg } from "@/lib/utils/placeholders";

export default function HomePage() {
  const router = useRouter();
  const startCombo = useComboStore((state) => state.startCombo);

  const activeCombo = useComboStore((state) => state.activeCombo);
  const [selectedDialId, setSelectedDialId] = React.useState<string>("combo-3");

  const handleStartCombo = (config: any) => {
    startCombo(config);
    router.push(`/combo/${config.slug}`);
  };

  const [isPlaying, setIsPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-20 pb-16 bg-white text-text-primary font-body">
      {/* 1. Apple Keynote Video Hero Stage */}
      <section className="relative mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 mt-4">
        <div className="relative w-full h-[65svh] sm:h-[75svh] md:h-[82svh] min-h-[520px] max-h-[880px] rounded-[32px] overflow-hidden bg-black shadow-2xl border border-white/10 group">
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-85"
            src="/sections/home-hero-preview.mp4"
            poster="/sections/home-hero.webp"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Interactive play/pause controller */}
          <button
            onClick={togglePlay}
            className="absolute bottom-6 right-6 z-20 h-10 w-10 rounded-full apple-glass-dark text-white backdrop-blur-md flex items-center justify-center transition-apple opacity-0 group-hover:opacity-100 active:scale-95 cursor-pointer border border-white/20"
          >
            {isPlaying ? (
              <span className="text-[10px] font-bold tracking-widest font-ui">PAUSE</span>
            ) : (
              <span className="text-[10px] font-bold tracking-widest font-ui">PLAY</span>
            )}
          </button>

          {/* Text Overlays - Apple Keynote styling */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-12 md:p-16 space-y-6 max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-[10px] font-bold font-ui uppercase tracking-widest w-max backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300 fill-current" />
              THE FUTURE OF FASHION COMMERCE
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight uppercase">
              BUILD YOUR <br />
              <span className="apple-headline">₹999 COMBO.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md font-ui">
              Choose your picks. Mix Men + Women styles. Configure sizes & colors dynamically. Make it yours.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" onClick={() => router.push("/combo")} className="w-full sm:w-auto font-ui font-extrabold bg-white text-black hover:bg-white/90 uppercase tracking-wider text-xs h-12 px-7 rounded-full cursor-pointer transition-apple shadow-lg">
                BUILD MY COMBO →
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                const el = document.getElementById("how-it-works-video");
                el?.scrollIntoView({ behavior: "smooth" });
              }} className="w-full sm:w-auto font-ui font-bold border-white/30 text-white hover:bg-white/15 hover:text-white uppercase tracking-wider text-xs h-12 px-7 rounded-full cursor-pointer backdrop-blur-md">
                SEE HOW IT WORKS
              </Button>
            </div>
            
            {/* Visual Combo Price Segment Pill */}
            <div className="pt-4 border-t border-white/15 flex items-center gap-3 text-[10px] uppercase font-bold text-gray-300 font-mono tracking-widest">
              <span className="bg-white/10 px-2 py-0.5 rounded-md">02</span>
              <span>·</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">03</span>
              <span>·</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">05</span>
              <span>·</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">08</span>
              <span>·</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">10</span>
              <span className="text-brand-primary font-ui font-bold ml-1">Picks for flat ₹999</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Apple Segmented Control Combo Selector */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase font-ui">FLEXIBLE PACK SIZES</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            CHOOSE YOUR ₹999 COMBO
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-ui">
            One flat base price. Select your preferred quantity tier below.
          </p>
        </div>

        {/* Apple Segmented Dial Picker */}
        <div className="max-w-2xl mx-auto bg-bg-secondary rounded-[28px] p-6 sm:p-8 border border-border-light/80 shadow-xs text-center space-y-8">
          {/* Segment Pill Row */}
          <div className="flex items-center justify-between bg-white p-1.5 rounded-full border border-border-light shadow-2xs select-none">
            {comboConfigs.map((config) => {
              const isActive = selectedDialId === config.id;
              return (
                <button
                  key={config.id}
                  onClick={() => setSelectedDialId(config.id)}
                  className={`flex-1 text-center text-sm sm:text-base font-extrabold font-heading transition-apple py-2.5 rounded-full cursor-pointer ${
                    isActive
                      ? "text-white bg-black shadow-md scale-102"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                  }`}
                >
                  {config.itemLimit} Picks
                </button>
              );
            })}
          </div>

          {/* Active Config Details */}
          {(() => {
            const currentConfig = comboConfigs.find(c => c.id === selectedDialId) || comboConfigs[1];
            return (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className={`inline-block text-[10px] font-bold font-ui px-3.5 py-1 rounded-full uppercase tracking-wider ${currentConfig.themeMetadata?.bgClass} ${currentConfig.themeMetadata?.colorClass}`}>
                  {currentConfig.badge}
                </span>
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-2xl text-text-primary uppercase">
                    {currentConfig.itemLimit} PICKS PACKAGE
                  </h3>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto font-ui">
                    {currentConfig.description}
                  </p>
                </div>
                <div className="flex justify-center items-baseline gap-2 pt-2">
                  <span className="text-4xl font-extrabold font-heading text-brand-primary">₹999</span>
                  <span className="text-xs text-text-secondary font-bold font-ui uppercase tracking-wider">flat base rate</span>
                </div>
                <Button
                  onClick={() => handleStartCombo(currentConfig)}
                  className="w-full max-w-xs h-12 uppercase font-ui font-extrabold tracking-wider text-xs bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full cursor-pointer shadow-md transition-apple"
                >
                  Start Building {currentConfig.itemLimit} Picks →
                </Button>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 3. Apple Bento Grid Feature Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase font-ui">WHY WE ARE DIFFERENT</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            ENGINEERED FOR FREEDOM
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-ui">
            Transparent policies, multi-combo carts, and true category mixability.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: Mix & Match Freedom (Large 7 Cols) */}
          <div className="md:col-span-7 bg-bg-secondary rounded-[28px] p-8 border border-border-light/80 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-3 z-10">
              <span className="text-[10px] font-extrabold font-ui text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3 py-1 rounded-full w-max inline-block">
                NO CATEGORY RESTRICTIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
                MIX MEN + WOMEN IN ONE COMBO
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-ui max-w-md">
                Want 3 Men's Shirts + 2 Women's Kurtas in a 5-item combo? You're in total control. Put them all in the same combo, select their sizes individually, and pay ₹999.
              </p>
            </div>
            <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden border border-border-light shadow-2xs bg-white">
              <Image
                src="/sections/mix-match-guide.webp"
                alt="Mix and Match Step-by-Step illustration"
                fill
                className="object-contain p-3 group-hover:scale-102 transition-apple"
                unoptimized
              />
            </div>
          </div>

          {/* Bento Card 2: COD 20% Advance (5 Cols) */}
          <div className="md:col-span-5 bg-black text-white rounded-[28px] p-8 border border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 font-heading font-extrabold text-sm">
                20%
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading uppercase text-white tracking-tight">
                COD 20% ADVANCE POLICY
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-ui">
                To eliminate non-serious orders, Cash on Delivery requires a 20% advance payment upon order placement. The remaining 80% is collected directly at your doorstep.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300 flex justify-between items-center">
              <span>Advance: 20%</span>
              <span>Doorstep: 80%</span>
            </div>
          </div>

          {/* Bento Card 3: Unboxing Video Requirement (6 Cols) */}
          <div className="md:col-span-6 bg-bg-secondary rounded-[28px] p-8 border border-border-light/80 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center font-heading font-extrabold text-sm">
                📹
              </div>
              <h3 className="text-xl font-extrabold font-heading uppercase text-text-primary tracking-tight">
                UNBOXING VIDEO REQUIREMENT
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-ui">
                For damage claims or missing items, a continuous unboxing video (showing parcel label clearly before opening) is mandatory. We don't accept standard exchanges.
              </p>
            </div>
            <Link href="/policies/damage-return" className="text-xs font-bold font-ui text-brand-accent hover:underline flex items-center gap-1">
              Read Unboxing Policy →
            </Link>
          </div>

          {/* Bento Card 4: Courier Charges Transparency (6 Cols) */}
          <div className="md:col-span-6 bg-bg-secondary rounded-[28px] p-8 border border-border-light/80 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-heading font-extrabold text-sm">
                📦
              </div>
              <h3 className="text-xl font-extrabold font-heading uppercase text-text-primary tracking-tight">
                SEPARATE COURIER CHARGES
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-ui">
                Courier costs are calculated separately based on weight and destination state. No hidden free-delivery inflation marks in product pricing.
              </p>
            </div>
            <Link href="/policies/shipping" className="text-xs font-bold font-ui text-emerald-600 hover:underline flex items-center gap-1">
              Read Shipping Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. How ₹999 Combo Works Video Section */}
      <section id="how-it-works-video" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase font-ui">SIMPLE 4-STEP PROCESS</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            HOW DOES THE ₹999 COMBO WORK?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-ui">
            Select your pack size, pick any styles, choose sizes/colors, and build your package for ₹999.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center bg-bg-secondary rounded-[32px] p-6 md:p-10 border border-border-light/80 shadow-xs">
          {/* Video Container */}
          <div className="md:col-span-7 relative aspect-video rounded-card overflow-hidden border border-border-light bg-black group shadow-sm">
            <video
              className="w-full h-full object-cover"
              poster="/sections/how-combo-works-poster.webp"
              muted
              playsInline
              loop
              autoPlay
              src="/sections/how-combo-works.mp4"
            />
            <div className="absolute bottom-3 left-3 apple-glass-dark px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
              <Video className="h-3 w-3" />
              <span>EXPLORE BUILDER FLOW</span>
            </div>
          </div>

          {/* Stepper Details */}
          <div className="md:col-span-5 space-y-6 font-body">
            <div className="space-y-4">
              {[
                { step: "01", title: "Choose Combo Size", desc: "Select 2, 3, 5, 8 or 10 item tiers based on your needs." },
                { step: "02", title: "Pick Eligible Styles", desc: "Select clothing items configured inside your collection." },
                { step: "03", title: "Configure Variants", desc: "Individually configure sizes and colours for each selected slot." },
                { step: "04", title: "Pay Base ₹999 Price", desc: "Confirm selections and pay ₹999 flat base rate for the combo." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 rounded-2xl bg-white border border-border-light/60 shadow-2xs">
                  <span className="h-7 w-7 rounded-xl bg-black text-white font-heading font-extrabold text-xs flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[11px] sm:text-xs text-text-secondary leading-normal font-ui">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cinematic Combo Narrative Story Strip (Visual banner scroll) */}
        <div className="border-t border-border-light/60 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
            <span className="text-[9px] font-bold tracking-widest text-brand-primary uppercase font-ui">CHOOSE · PICK · COMPLETE</span>
            <h3 className="text-xl font-extrabold font-heading text-text-primary uppercase">Build Your Combo Story</h3>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible">
            {/* Slide 1 */}
            <div className="bg-bg-secondary p-6 rounded-[24px] border border-border-light/80 shrink-0 w-[280px] snap-center sm:w-auto space-y-3">
              <span className="text-[10px] font-extrabold text-brand-accent tracking-widest uppercase font-ui">STEP 01</span>
              <h4 className="font-heading font-bold text-sm text-text-primary uppercase">Choose Your Combo</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-ui">Choose from 2, 3, 5, 8 or 10 picks combo sizes. All tiers cost a flat ₹999 base price.</p>
            </div>
            {/* Slide 2 */}
            <div className="bg-bg-secondary p-6 rounded-[24px] border border-border-light/80 shrink-0 w-[280px] snap-center sm:w-auto space-y-3">
              <span className="text-[10px] font-extrabold text-brand-primary tracking-widest uppercase font-ui">STEP 02</span>
              <h4 className="font-heading font-bold text-sm text-text-primary uppercase">Choose Any Style</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-ui">Mix Men's clothing + Women's dresses in the same combo. Choose styles from selected assortments.</p>
            </div>
            {/* Slide 3 */}
            <div className="bg-bg-secondary p-6 rounded-[24px] border border-border-light/80 shrink-0 w-[280px] snap-center sm:w-auto space-y-3">
              <span className="text-[10px] font-extrabold text-emerald-600 tracking-widest uppercase font-ui">STEP 03</span>
              <h4 className="font-heading font-bold text-sm text-text-primary uppercase">Combo Complete</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-ui">Review selected items, add variant parameters, and pay with Cash on Delivery (COD) 20% advance options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section - 12 Categories grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border-light pb-4">
          <h2 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            SHOP BY CATEGORY
          </h2>
          <p className="text-xs text-text-secondary font-ui">
            Explore trending silhouettes across categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Men's Shirts", code: "shirts", count: "4 Styles", image: "/products/men/emerald-check-casual-shirt/front.webp" },
            { name: "Men's T-Shirts", code: "t-shirts", count: "4 Styles", image: "/products/men/midnight-black-oversized-graphic-tee/front.webp" },
            { name: "Men's Pants", code: "pants", count: "4 Styles", image: "/products/men/indigo-comfort-cargo-pant/front.webp" },
            { name: "Men's Lowers", code: "lowers", count: "4 Styles", image: "/products/men/emerald-active-sport-jogger/front.webp" },
            { name: "Men's Shorts", code: "shorts", count: "4 Styles", image: "/products/men/sandstone-cargo-shorts/front.webp" },
            { name: "Traditional Vesti", code: "vesti-sets", count: "4 Styles", image: "/products/men/traditional-gold-border-vesti/front.webp" },
            { name: "Women's Tops", code: "tops", count: "3 Styles", image: "/products/women/rosewood-printed-rayon-top/front.webp" },
            { name: "Women's Leggings", code: "leggings", count: "3 Styles", image: "/products/women/scarlet-red-cotton-leggings/front.webp" },
            { name: "Women's Jeans", code: "jeans", count: "2 Styles", image: "/products/women/indigo-high-waist-mom-jeans/front.webp" },
            { name: "Women's Palazzo", code: "palazzo", count: "3 Styles", image: "/products/women/indigo-block-printed-palazzo/front.webp" },
            { name: "Straight Pants", code: "straight-pants", count: "3 Styles", image: "/products/women/classic-black-straight-pants/front.webp" },
            { name: "Kurta Sets", code: "cotton-sets", count: "4 Styles", image: "/products/women/festival-gota-work-kurta-set/front.webp" },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => router.push(`/products?category=${cat.code}`)}
              className="group cursor-pointer rounded-[20px] border border-border-light/80 overflow-hidden bg-white p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-lg hover:border-black/20 transition-apple"
            >
              <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-bg-secondary mb-3 shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-apple"
                />
              </div>
              <h4 className="font-heading font-extrabold text-[11px] sm:text-xs text-text-primary uppercase tracking-wide truncate max-w-full">
                {cat.name}
              </h4>
              <span className="text-[9px] font-bold text-text-muted font-ui mt-0.5">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Combo Products Row */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="flex items-center justify-between border-b border-border-light pb-4">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
              TRENDING IN ₹999 COMBOS
            </h2>
            <p className="text-xs text-text-secondary font-ui">
              Our most popular style picks, fully eligible for any combo size.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/products")} className="cursor-pointer rounded-full border-border-light font-ui font-semibold">
            View All
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.filter((p) => p.featured).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Shop by Gender Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border-light pb-4">
          <h2 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            SHOP BY GENDER
          </h2>
          <p className="text-xs text-text-secondary font-ui">
            Pick your catalog to explore, or start mixing in the Combo Builder!
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Men's landing card */}
          <div className="group relative rounded-[32px] overflow-hidden aspect-[4/5] sm:aspect-[4/3] border border-border-light shadow-sm">
            <Image
              src="/sections/men-combo-card.webp"
              alt="Men's Fashion Landing"
              fill
              className="object-cover group-hover:scale-103 transition-apple"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 space-y-3">
              <span className="inline-block text-[9px] font-bold font-ui bg-brand-primary text-white px-3 py-1 rounded-full w-max uppercase tracking-wider">
                MEN'S SERIES
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-white uppercase">MEN'S COMBOS</h3>
              <p className="text-xs text-gray-300 max-w-sm font-ui">Explore shirts, polos, chinos, and wedding vesti sets.</p>
              <div className="flex gap-3 pt-1">
                <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 font-ui font-bold" asChild><Link href="/men">Explore Men's</Link></Button>
                <Button size="sm" variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/15 hover:text-white font-ui font-bold backdrop-blur-md" onClick={() => router.push("/combo/5-items")}>
                  Build Men Combo
                </Button>
              </div>
            </div>
          </div>

          {/* Women's landing card */}
          <div className="group relative rounded-[32px] overflow-hidden aspect-[4/5] sm:aspect-[4/3] border border-border-light shadow-sm">
            <Image
              src="/sections/women-combo-card.webp"
              alt="Women's Fashion Landing"
              fill
              className="object-cover group-hover:scale-103 transition-apple"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 space-y-3">
              <span className="inline-block text-[9px] font-bold font-ui bg-brand-accent text-white px-3 py-1 rounded-full w-max uppercase tracking-wider">
                WOMEN'S SERIES
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-white uppercase">WOMEN'S COMBOS</h3>
              <p className="text-xs text-gray-300 max-w-sm font-ui">Explore tops, crop tees, ethnic cotton sets, and lehengas.</p>
              <div className="flex gap-3 pt-1">
                <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 font-ui font-bold" asChild><Link href="/women">Explore Women's</Link></Button>
                <Button size="sm" variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/15 hover:text-white font-ui font-bold backdrop-blur-md" onClick={() => router.push("/combo/5-items")}>
                  Build Women Combo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews - Apple Glass Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 bg-bg-secondary py-14 rounded-[32px] border border-border-light/80">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase font-ui">REAL CUSTOMER FEEDBACK</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-ui">
            Verified reviews from customers who built ₹999 combo packs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mockHomeReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-[24px] border border-border-light/80 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-base">★</span>
                  ))}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed italic font-ui">
                  "{review.comment}"
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border-light/60 pt-3.5 text-[10px] text-text-muted font-ui">
                <span className="font-heading font-bold text-text-primary">{review.customerName}</span>
                <span className="bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full font-bold">{review.comboPurchased}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
