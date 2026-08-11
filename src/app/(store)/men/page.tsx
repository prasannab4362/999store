"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function MenPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/products?gender=men");
  }, [router]);

  return null;
}
