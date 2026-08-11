"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CategoryTile {
  name: string;
  code: string;
  count: string;
  image: string;
}

interface CategoryGridProps {
  categories: CategoryTile[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {categories.map((cat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={() => router.push(`/products?category=${cat.code}`)}
          className="group cursor-pointer rounded-[24px] overflow-hidden bg-white flex flex-col items-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-[400ms] hover:-translate-y-[4px]"
        >
          <div className="relative h-36 w-full bg-[#EFEFF1] overflow-hidden">
            <img
              src={cat.image}
              alt={cat.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-[var(--ease-apple)]"
            />
          </div>
          <div className="p-3.5 space-y-0.5">
            <h4 className="font-medium text-xs text-text-primary tracking-normal truncate w-full">{cat.name}</h4>
            <span className="text-[11px] font-normal text-text-muted">{cat.count}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
