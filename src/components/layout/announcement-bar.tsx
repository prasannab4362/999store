"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  "All Combos — Flat ₹999",
  "Mix Men + Women in One Combo",
  "COD Available with 20% Advance",
  "Courier Charges Extra"
];

export function AnnouncementBar() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setIndex((prev) => (prev + 1) % announcements.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <div className="relative bg-[#1D1D1F] text-[#F5F5F7] text-[11px] font-medium py-2 px-10 flex items-center justify-center font-ui select-none overflow-hidden h-8 tracking-[0.06em]">
      <button
        onClick={handlePrev}
        className="absolute left-3 p-1 hover:opacity-70 active:scale-90 text-white/60 cursor-pointer transition-opacity"
        aria-label="Previous Announcement"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center tracking-[0.06em]"
        >
          {announcements[index]}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleNext}
        className="absolute right-3 p-1 hover:opacity-70 active:scale-90 text-white/60 cursor-pointer transition-opacity"
        aria-label="Next Announcement"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
export default AnnouncementBar;
