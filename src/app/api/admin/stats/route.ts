import { NextResponse } from "next/server";
import { StoreBackendDB } from "@/lib/db/store-db";

export async function GET() {
  try {
    const stats = StoreBackendDB.getStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin statistics." },
      { status: 500 }
    );
  }
}
