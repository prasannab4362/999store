import { NextRequest, NextResponse } from "next/server";
import { StoreBackendDB } from "@/lib/db/store-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "PIN code parameter required." },
        { status: 400 }
      );
    }

    const result = StoreBackendDB.checkPincode(code);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to check PIN code delivery serviceability." },
      { status: 500 }
    );
  }
}
