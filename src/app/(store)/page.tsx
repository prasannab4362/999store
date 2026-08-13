// Server Component — no "use client" directive
// Interactive islands are imported as client components below

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, Shield, Truck, RotateCcw } from "lucide-react";
import { mockHomeReviews } from "@/data/mock/reviews";
import { FeaturedProductsSection } from "@/components/home/featured-products-island";
import { PolicyNotice } from "@/components/commerce/policy-notice";

// Client islands
import { HeroIsland } from "@/components/home/hero-island";
import { ComboDial } from "@/components/home/combo-dial-island";
import { GenderCardsIsland } from "@/components/home/gender-cards-island";
import { CategoryGrid } from "@/components/home/category-grid-island";
import { ViewAllButton, MixMatchCTAButton } from "@/components/home/button-islands";
import { SectionWrapper } from "@/components/home/section-wrapper";

// Section eyebrow label
function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs font-medium uppercase tracking-[0.15em] font-ui ${light ? "text-white/50" : "text-text-muted"}`}>
      {children}
    </p>
  );
}

// Static category data — defined at module level, zero runtime cost
const CATEGORY_TILES = [
  { name: "Men's Shirts",     code: "shirts",         count: "4 Styles", image: "/products/men/emerald-check-casual-shirt/front.webp" },
  { name: "Men's T-Shirts",   code: "t-shirts",       count: "4 Styles", image: "/products/men/midnight-black-oversized-graphic-tee/front.webp" },
  { name: "Men's Pants",      code: "pants",          count: "4 Styles", image: "/products/men/midnight-blue-cargo-denim-pant/front.webp" },
  { name: "Men's Lowers",     code: "lowers",         count: "4 Styles", image: "/products/men/charcoal-grey-slim-jogger/front.webp" },
  { name: "Men's Shorts",     code: "shorts",         count: "4 Styles", image: "/products/men/camo-printed-cargo-shorts/front.webp" },
  { name: "Traditional Vesti",code: "vesti-sets",     count: "4 Styles", image: "/products/men/traditional-gold-border-vesti-shirt-set/front.webp" },
  { name: "Women's Tops",     code: "tops",           count: "3 Styles", image: "/products/women/rosewood-printed-rayon-top/front.webp" },
  { name: "Women's Leggings", code: "leggings",       count: "3 Styles", image: "/products/women/classic-maroon-cotton-lycra-leggings/front.webp" },
  { name: "Women's Jeans",    code: "jeans",          count: "2 Styles", image: "/products/women/retro-light-blue-mom-fit-jeans/front.webp" },
  { name: "Women's Palazzo",  code: "palazzo",        count: "3 Styles", image: "/products/women/indigo-floral-printed-rayon-palazzo/front.webp" },
  { name: "Straight Pants",   code: "straight-pants", count: "3 Styles", image: "/products/women/office-classic-black-straight-pant/front.webp" },
  { name: "Kurta Sets",       code: "cotton-sets",    count: "4 Styles", image: "/products/women/pastel-pink-festive-cotton-kurta-set/front.webp" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "999 Combo Store",
    url: "https://999combostore.com",
    logo: "https://999combostore.com/logo.png",
    sameAs: ["https://facebook.com/999combostore", "https://instagram.com/999combostore"]
  };

  return (
    <div className="bg-white text-text-primary font-body overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ═══════════════════════════════════════════════════════
          1. CINEMATIC VIDEO HERO — Client Island (video + router)
      ═══════════════════════════════════════════════════════ */}
      <HeroIsland />

      {/* ═══════════════════════════════════════════════════════
          2. TRUST STRIP — Frosted Glass Cards (Server + Client Wrapper)
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-12">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Shield,       label: "Quality Assured",    sub: "Every piece inspected" },
              { icon: Truck,        label: "Pan India Delivery", sub: "All major pin codes" },
              { icon: RotateCcw,    label: "Damage Claims",      sub: "Video proof accepted" },
              { icon: CheckCircle2, label: "₹999 Flat Price",    sub: "All combo tiers" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-5 sm:p-6 bg-[#F5F5F7]/80 backdrop-blur-md rounded-2xl transition-all duration-300 hover:bg-[#EFEFF1]"
                >
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
                    <Icon className="h-4 w-4 text-text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary leading-tight">{item.label}</p>
                    <p className="text-[11px] text-text-muted mt-0.5 font-ui">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. COMBO DIAL SELECTOR — Alternating BG (#F5F5F7)
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F7] py-20 sm:py-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Eyebrow>The Choice is Yours</Eyebrow>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight leading-[1.08]">
              Curate Your ₹999 Combo
            </h2>
            <p className="text-base sm:text-lg text-text-secondary font-ui leading-relaxed">
              One flat price. Endless combinations. Select your tier size below to start building your personalized fashion package.
            </p>
          </div>
          <ComboDial />
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. HOW THE COMBO WORKS — White BG
      ═══════════════════════════════════════════════════════ */}
      <section id="how-it-works-video" className="bg-white py-20 sm:py-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Eyebrow>The Process</Eyebrow>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight leading-[1.08]">
              How The Combo Works
            </h2>
            <p className="text-base sm:text-lg text-text-secondary font-ui leading-relaxed">
              Select pack size, pick any styles across collections, choose sizes, and build your package for just ₹999.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Video */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-xl)] bg-[#1D1D1F] group">
              <video
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                poster="/sections/how-combo-works-narrative.webp"
                muted playsInline loop autoPlay
                src="/sections/how-combo-works.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

            {/* Steps */}
            <div className="space-y-3.5">
              {[
                { step: "01", title: "Choose Combo Size",   desc: "Select 2, 3, 5, 8 or 10 item tiers based on your styling needs." },
                { step: "02", title: "Pick Eligible Styles", desc: "Mix and match from any eligible Men's or Women's collections." },
                { step: "03", title: "Configure Variants",  desc: "Individually configure sizes and colours for each selected slot." },
                { step: "04", title: "Pay Base ₹999 Price", desc: "Confirm selections and checkout with a flat ₹999 base rate." },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group flex gap-4 items-start p-5 sm:p-6 rounded-2xl bg-[#F5F5F7] hover:bg-[#EFEFF1] transition-colors duration-300"
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-white text-text-primary font-semibold text-sm font-ui flex items-center justify-center shadow-[var(--shadow-sm)]">
                    {item.step}
                  </div>
                  <div className="space-y-1 pt-0.5">
                    <h4 className="font-semibold text-sm text-text-primary tracking-normal">{item.title}</h4>
                    <p className="text-[13px] text-text-secondary leading-relaxed font-ui">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. MIX & MATCH ADVANTAGE — Deep Dark Card
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-10">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="relative rounded-3xl bg-[#1D1D1F] text-white p-8 md:p-14 lg:p-20 grid lg:grid-cols-2 gap-14 items-center overflow-hidden shadow-[var(--shadow-xl)]">

            <div className="space-y-8 relative z-10">
              <div className="space-y-5">
                <Eyebrow light>Freedom to Mix</Eyebrow>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading tracking-tight leading-[1.08]">
                  The Mix & Match{" "}
                  <span className="text-[#D4AF37]">Advantage.</span>
                </h2>
                <p className="text-[15px] sm:text-lg text-white/50 leading-relaxed max-w-md font-ui">
                  Unlike standard stores, we don't lock you into a single gender or product category. Want to pick 3 Shirts for yourself, 2 Kurtas for your partner, and 5 trackpants for college?{" "}
                  <strong className="text-white/90">Go right ahead.</strong>
                </p>
                <p className="text-sm text-white/35 font-ui">
                  Put them all in the same combo, select sizes individually, and pay a single base price.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
                {[
                  { num: "Unlimited", text: "Mix & Match" },
                  { num: "Cross",     text: "Category" },
                  { num: "Single",    text: "Price" },
                ].map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="block font-semibold font-heading text-[#D4AF37] text-lg sm:text-xl tracking-tight">{step.num}</span>
                    <span className="block text-[11px] font-medium text-white/35 uppercase tracking-wide">{step.text}</span>
                  </div>
                ))}
              </div>

              <MixMatchCTAButton />
            </div>

            {/* Visual Guide */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 p-4 lg:p-8">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-white">
                <Image
                  src="/sections/mix-match-guide.webp"
                  alt="Mix and Match Step-by-Step illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4"
                />
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. SHOP BY CATEGORY — Alternating BG (#F5F5F7)
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F7] py-20 sm:py-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8 mb-12">
            <div className="space-y-2">
              <Eyebrow>Explore The Store</Eyebrow>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight leading-[1.08]">
                Shop by Category
              </h2>
            </div>
            <p className="text-sm sm:text-base text-text-secondary font-ui max-w-xs">
              Explore trending silhouettes across all collections.
            </p>
          </div>

          <CategoryGrid categories={CATEGORY_TILES} />
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. FEATURED PRODUCTS — White BG
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between pb-8 mb-12 gap-4">
            <div className="space-y-2">
              <Eyebrow>Curated Selections</Eyebrow>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight leading-[1.08]">
                Trending In Combos
              </h2>
            </div>
            <ViewAllButton href="/products" label="View All" />
          </div>

          <FeaturedProductsSection />
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8. SHOP BY GENDER — Alternating BG (#F5F5F7)
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F7] py-20 sm:py-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8 mb-12">
            <div className="space-y-2">
              <Eyebrow>Targeted Shopping</Eyebrow>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight leading-[1.08]">
                Shop by Gender
              </h2>
            </div>
            <p className="text-sm sm:text-base text-text-secondary font-ui max-w-xs">
              Pick your catalog or start mixing in the Combo Builder.
            </p>
          </div>
          <GenderCardsIsland />
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. STORE POLICIES — White BG
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Eyebrow>Transparency First</Eyebrow>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight leading-[1.08]">
              Store Policies
            </h2>
            <p className="text-base sm:text-lg text-text-secondary font-ui leading-relaxed">
              We believe in complete transparency. Review our simple rules before placing your combo order.
            </p>
          </div>
          <PolicyNotice variant="full" />
        </SectionWrapper>
      </section>

      {/* ═══════════════════════════════════════════════════════
          10. CUSTOMER REVIEWS — Deep Dark Card
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 sm:py-20 pb-28">
        <SectionWrapper className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="bg-[#1D1D1F] p-8 sm:p-16 rounded-3xl shadow-[var(--shadow-xl)]">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <Eyebrow light>Verified Feedback</Eyebrow>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-white tracking-tight leading-[1.08]">
                What Customers Say
              </h2>
              <p className="text-sm sm:text-base text-white/40 font-ui leading-relaxed">
                Real reviews from customers who purchased our curated combo packs.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {mockHomeReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/[0.06] p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 transition-colors hover:bg-white/[0.09]"
                >
                  <div className="space-y-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="text-[#D4AF37] text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed font-ui">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70">
                        {review.customerName.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-white/85">{review.customerName}</span>
                    </div>
                    <span className="text-[11px] font-medium text-white/35 uppercase tracking-wide">
                      {review.comboPurchased}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </section>
    </div>
  );
}
