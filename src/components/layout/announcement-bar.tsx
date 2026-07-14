"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  "ALL COMBOS ₹999",
  "MIX MEN + WOMEN IN ONE COMBO",
  "COD AVAILABLE WITH 20% ADVANCE",
  "COURIER CHARGES EXTRA"
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
    <div className="relative bg-brand-primary text-brand-primary-foreground text-xs font-semibold py-2 px-10 flex items-center justify-center font-heading select-none overflow-hidden h-9">
      <button
        onClick={handlePrev}
        className="absolute left-3 p-1 hover:opacity-85 active:scale-90 text-brand-primary-foreground/80 cursor-pointer"
        aria-label="Previous Announcement"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center font-semibold tracking-wide"
        >
          {announcements[index]}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleNext}
        className="absolute right-3 p-1 hover:opacity-85 active:scale-90 text-brand-primary-foreground/80 cursor-pointer"
        aria-label="Next Announcement"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
export default AnnouncementBar;
