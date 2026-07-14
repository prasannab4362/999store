"use client";

import Link from "next/link";
import Image from "next/image";
import { collections } from "@/data/mock/collections";
import { Button } from "@/components/ui/button";
import { getPlaceholderSvg } from "@/lib/utils/placeholders";

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 font-body">
      <div className="text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
          Shop Collections
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Explore curated style capsules for every mood, season, and occasion. Add them to your fashion combo pack!
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((coll) => (
          <div
            key={coll.id}
            className="group relative rounded-promo overflow-hidden aspect-[4/3] border border-border-light shadow-sm bg-white"
          >
            <Image
              src={getPlaceholderSvg(coll.name, 600, 450, "F3F4F6", "0F9D58")}
              alt={coll.name}
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 space-y-2">
              <h3 className="font-heading font-extrabold text-xl text-white uppercase">{coll.name}</h3>
              <p className="text-xs text-gray-300 line-clamp-2">{coll.description}</p>
              <div className="pt-2">
                <Link href={`/collections/${coll.id}`} passHref legacyBehavior>
                  <Button size="sm" asChild>
                    <a>View Styles</a>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
