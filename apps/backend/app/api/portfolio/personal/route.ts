import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders, handleCorsPreFlight } from "@/src/lib/cors";

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async() =>{

    const personalInfo = await prisma.personalInfo.findFirst();
    
    if (!personalInfo) {
      return NextResponse.json(
        { ok: false, error: "Personal info not found" },
        { status: 404, headers: corsHeaders(request) }
      );
    }
    
    return NextResponse.json({ ok: true, data: personalInfo }, { headers: corsHeaders(request) });
  })
}

export async function PUT(request: NextRequest) {
  return withErrorHandling(request, async() => {

    const body = await request.json();
    
    const personalInfo = await prisma.personalInfo.upsert({
      where: { email: body.email },
      update: body,
      create: body,
    });
    
    return NextResponse.json({ ok: true, data: personalInfo }, { headers: corsHeaders(request) });
  })
}

export function OPTIONS(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;
  return new Response(null, { status: 204 });
}
