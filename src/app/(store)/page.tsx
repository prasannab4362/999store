"use client";

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
    <div className="space-y-16 pb-12 bg-white text-text-primary font-body">
      {/* 1. Cinematic Video Hero Section */}
      <section className="relative mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 mt-4">
        <div className="relative w-full h-[65svh] sm:h-[75svh] md:h-[80svh] min-h-[500px] max-h-[850px] rounded-promo overflow-hidden bg-black shadow-lg border border-border-light/40 group">
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="/sections/home-hero-preview.mp4"
            poster="/sections/home-hero.webp"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30" />

          {/* Interactive play/pause controller */}
          <button
            onClick={togglePlay}
            className="absolute bottom-6 right-6 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-95 cursor-pointer border border-white/20"
          >
            {isPlaying ? (
              <span className="text-[10px] font-bold tracking-widest font-heading">PAUSE</span>
            ) : (
              <span className="text-[10px] font-bold tracking-widest font-heading">PLAY</span>
            )}
          </button>

          {/* Text Overlays - Editorial D2C styling */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-12 md:p-16 space-y-6 max-w-2xl text-white">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/25 text-white text-[9px] font-bold font-heading uppercase tracking-widest w-max backdrop-blur-xs">
              THE NEW WAY TO SHOP FASHION
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-none uppercase">
              BUILD YOUR <br />
              <span className="text-brand-primary">₹999 COMBO.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md">
              Choose your picks. Mix Men + Women styles. Configure sizes & colours dynamically. Make it yours.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" onClick={() => router.push("/combo")} className="w-full sm:w-auto font-heading font-extrabold bg-brand-primary hover:bg-brand-primary-hover text-white uppercase tracking-wider text-xs h-12 px-6 rounded-lg cursor-pointer">
                BUILD MY COMBO →
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                const el = document.getElementById("how-it-works-video");
                el?.scrollIntoView({ behavior: "smooth" });
              }} className="w-full sm:w-auto font-heading font-extrabold border-white text-white hover:bg-white/10 hover:text-white uppercase tracking-wider text-xs h-12 px-6 rounded-lg cursor-pointer">
                SEE HOW IT WORKS
              </Button>
            </div>
            
            {/* Visual Combo Price Marker */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-[10px] uppercase font-bold text-gray-300 font-heading tracking-wider">
              <span>02</span>
              <span>·</span>
              <span>03</span>
              <span>·</span>
              <span>05</span>
              <span>·</span>
              <span>08</span>
              <span>·</span>
              <span>10</span>
              <span className="text-brand-primary">Picks for flat ₹999</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Combo Dial Selector Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            CHOOSE YOUR ₹999 COMBO
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            One price. Different collections. Your choice. Drag or tap a tier size.
          </p>
        </div>

        {/* Dynamic Combo Dial Segment Selector */}
        <div className="max-w-2xl mx-auto bg-bg-secondary rounded-promo p-8 border border-border-light/60 shadow-xs text-center space-y-8">
          {/* Dial Selection row */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 border-b border-border-light/40 pb-6 overflow-x-auto scrollbar-none select-none">
            {comboConfigs.map((config) => {
              const isActive = selectedDialId === config.id;
              return (
                <button
                  key={config.id}
                  onClick={() => setSelectedDialId(config.id)}
                  className={`text-2xl sm:text-4xl font-extrabold font-heading transition-all duration-300 px-4 py-2 rounded-xl cursor-pointer ${
                    isActive
                      ? "text-brand-primary bg-white scale-110 shadow-sm border border-border-light/50"
                      : "text-text-secondary/50 hover:text-text-primary hover:scale-105"
                  }`}
                >
                  {config.itemLimit.toString().padStart(2, "0")}
                </button>
              );
            })}
          </div>

          {/* Description layout details */}
          {(() => {
            const currentConfig = comboConfigs.find(c => c.id === selectedDialId) || comboConfigs[1];
            return (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className={`inline-block text-[9px] font-bold font-heading px-3 py-1 rounded-full ${currentConfig.themeMetadata?.bgClass} ${currentConfig.themeMetadata?.colorClass}`}>
                  {currentConfig.badge}
                </span>
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-xl text-text-primary uppercase">
                    {currentConfig.itemLimit} PICKS COMBO
                  </h3>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">
                    {currentConfig.description}
                  </p>
                </div>
                <div className="flex justify-center items-baseline gap-1.5 pt-2">
                  <span className="text-3xl font-extrabold font-heading text-brand-primary">₹999</span>
                  <span className="text-xs text-text-secondary font-semibold">flat price</span>
                </div>
                <Button
                  onClick={() => handleStartCombo(currentConfig)}
                  className="w-full max-w-xs h-11 uppercase font-heading font-extrabold tracking-wider text-xs bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg cursor-pointer"
                >
                  Start Building {currentConfig.itemLimit} Picks →
                </Button>
              </div>
            );
          })()}
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

      {/* 3. How ₹999 Combo Works Video Section */}
      <section id="how-it-works-video" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            HOW DOES THE ₹999 COMBO WORK?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Select your pack size, pick any styles, choose sizes/colours, and build your package for ₹999.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center bg-bg-secondary rounded-promo p-6 md:p-10 border border-border-light shadow-sm">
          {/* Video Container */}
          <div className="md:col-span-7 relative aspect-video rounded-card overflow-hidden border border-border-light bg-black group shadow-sm">
            <video
              className="w-full h-full object-cover"
              poster="/sections/how-combo-works-poster.webp"
              muted
              playsInline
              loop
              autoPlay
            >
              <source src="/sections/how-combo-works.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition-colors">
              <button className="h-14 w-14 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer">
                <Play className="h-6 w-6 fill-current ml-1" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
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
                <div key={idx} className="flex gap-4 items-start">
                  <span className="h-7 w-7 rounded-lg bg-brand-primary-soft text-brand-primary font-heading font-extrabold text-xs flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[11px] sm:text-xs text-text-secondary leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
            className="object-contain p-2"
            unoptimized
          />
        </div>
      </section>

      {/* Shop by Category Section - 12 Categories grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border-light pb-4">
          <h2 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            SHOP BY CATEGORY
          </h2>
          <p className="text-xs text-text-secondary">
            Quick fashion category rails. Explore trending silhouettes immediately.
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
              className="group cursor-pointer rounded-card border border-border-light overflow-hidden bg-white p-3 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:border-brand-primary/20 transition-all"
            >
              <div className="relative h-28 w-full rounded-xl overflow-hidden bg-bg-secondary mb-3 shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-heading font-extrabold text-[11px] sm:text-xs text-text-primary uppercase tracking-wide truncate max-w-full">
                {cat.name}
              </h4>
              <span className="text-[9px] font-bold text-text-muted mt-0.5">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Combo Products Row */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        <div className="flex items-center justify-between border-b border-border-light pb-4">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
              TRENDING IN ₹999 COMBOS
            </h2>
            <p className="text-xs text-text-secondary">
              Our most popular style picks, fully eligible for any combo size.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/products")} className="cursor-pointer">
            View All
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.filter((p) => p.featured).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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
          <div className="group relative rounded-promo overflow-hidden aspect-[4/5] sm:aspect-[4/3] border border-border-light shadow-sm">
            <Image
              src="/sections/men-combo-card.webp"
              alt="Men's Fashion Landing"
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 space-y-3">
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
          <div className="group relative rounded-promo overflow-hidden aspect-[4/5] sm:aspect-[4/3] border border-border-light shadow-sm">
            <Image
              src="/sections/women-combo-card.webp"
              alt="Women's Fashion Landing"
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 space-y-3">
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
