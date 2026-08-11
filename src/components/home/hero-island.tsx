"use client";

import * as React from "react";
import { ArrowRight, Play, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/sections/home-hero.webp",
    badge: "✦ THE ALL-NEW ₹999 COMBO",
    badgeSub: "Flat Base Rate · All Collections",
    title: "Build Your",
    highlight: "₹999",
    subtitle: "Combo.",
    desc: "Choose your picks. Mix Men & Women styles. Configure sizes dynamically. Elevate your wardrobe.",
    cta: "Build My Combo",
  },
  {
    id: 2,
    image: "/sections/mix-match-guide.webp",
    badge: "✦ FREEDOM TO MIX & MATCH",
    badgeSub: "Cross-Category Styling",
    title: "Freedom To",
    highlight: "Mix",
    subtitle: "Everything.",
    desc: "Shirts for you, kurtas for your partner, trackpants for college — all in a single ₹999 package.",
    cta: "Explore Builder",
  },
];

export function HeroIsland() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.01, 1.10]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.75], [0, 35]);

  // Auto-advance slides smoothly every 7 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section ref={containerRef} className="relative mx-auto max-w-[1280px] w-full px-3 sm:px-6 lg:px-8 mt-3 sm:mt-4">
      {/* Clean Mac Neo Glass Container (Dots Removed) */}
      <div className="relative w-full h-[80svh] sm:h-[86svh] min-h-[600px] max-h-[980px] rounded-3xl overflow-hidden bg-[#0A0A0C] shadow-[0_30px_90px_rgba(0,0,0,0.45)] group border border-white/15">

        {/* Mac Neo Ambient Spotlight Radial Beams */}
        <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] rounded-full bg-[#D4AF37]/12 blur-[140px] pointer-events-none z-0" />
        <div className="absolute -bottom-24 right-12 w-[550px] h-[550px] rounded-full bg-[#3A3A3C]/40 blur-[160px] pointer-events-none z-0" />

        {/* Slide Image / Mac Neo Poster Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <motion.div style={{ scale: videoScale }} className="w-full h-full">
              <img
                src={activeSlide.image}
                alt="Apple Mac Neo Style Fashion Editorial"
                className="w-full h-full object-cover object-center sm:object-right-top"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Reliable Ambient Video Blend Layer */}
        <video
          ref={videoRef}
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none transition-opacity duration-700 z-0 ${
            videoLoaded ? "opacity-25" : "opacity-0"
          }`}
          src="/sections/home-hero-preview.mp4"
          poster="/sections/home-hero.webp"
          muted playsInline loop autoPlay preload="auto"
        />

        {/* Directional Dark Titanium Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/92 via-[#0A0A0C]/60 to-transparent pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/90 via-transparent to-[#0A0A0C]/40 pointer-events-none z-[1]" />

        {/* Mac Neo Floating Frosted Glass Widgets (Right Side) */}
        <div className="hidden lg:flex flex-col gap-3.5 absolute top-10 right-10 z-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white shadow-[0_16px_40px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-all"
          >
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Flat ₹999 Base Price</p>
              <p className="text-[11px] text-white/60 font-ui">No hidden per-item fees</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white shadow-[0_16px_40px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-all"
          >
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
              <RefreshCw className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Mix Men & Women</p>
              <p className="text-[11px] text-white/60 font-ui">Configure individual sizes</p>
            </div>
          </motion.div>
        </div>

        {/* Video Play/Pause Toggle */}
        <button
          onClick={togglePlay}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-95 cursor-pointer border border-white/15 shadow-lg"
        >
          {isPlaying ? (
            <span className="text-[8px] font-semibold tracking-widest font-ui">II</span>
          ) : (
            <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
          )}
        </button>

        {/* Mac Neo Hero Typography Content */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex flex-col justify-end p-7 sm:p-14 lg:p-20 max-w-3xl text-white"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              {/* Mac Neo Shimmer Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-[#D4AF37] font-ui tracking-wide backdrop-blur-xl">
                <span>{activeSlide.badge}</span>
              </div>

              {/* Headline with Gold Metallic Finish */}
              <h1 className="apple-hero-display text-white">
                {activeSlide.title}{" "}
                <span className="gold-metallic-text">{activeSlide.highlight}</span>
                <br />
                <span className="text-white/40">{activeSlide.subtitle}</span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-md font-ui font-normal">
                {activeSlide.desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => router.push("/combo")}
                  className="group inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-full bg-white text-[#1D1D1F] font-semibold text-[17px] shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-[2px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer"
                >
                  {activeSlide.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById("how-it-works-video")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center h-13 px-8 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white/90 font-semibold text-[17px] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:-translate-y-[2px] cursor-pointer"
                >
                  See How It Works
                </button>
              </div>

              {/* Tagline */}
              <div className="pt-4 mt-2 border-t border-white/10 flex items-center gap-4 text-xs font-ui text-white/40">
                <span className="flex items-center gap-1.5 text-white/60 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Guaranteed Flat Rate
                </span>
                <span>·</span>
                <span>2, 3, 5, 8, 10 Items</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* macOS Dock Style Slide Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className="relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden"
                style={{ width: isActive ? "32px" : "8px" }}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-white" : "bg-white/35 hover:bg-white/70"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
