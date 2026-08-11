"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function WomenPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/products?gender=women");
  }, [router]);

  return null;
}
