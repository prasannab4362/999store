import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/account`);
}
