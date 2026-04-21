import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getPersonalInfo(request: NextRequest) {
  const personalInfo = await prisma.personalInfo.findFirst();

  if (!personalInfo) {
    return NextResponse.json(
      { ok: false, error: "Personal info not found" },
      { status: 404, headers: corsHeaders(request) }
    );
  }

  return NextResponse.json({ ok: true, data: personalInfo }, { headers: corsHeaders(request) });
}

async function updatePersonalInfo(request: NextRequest) {
  const body = await request.json();

  const personalInfo = await prisma.personalInfo.upsert({
    where: { email: body.email },
    update: body,
    create: body,
  });

  return NextResponse.json({ ok: true, data: personalInfo }, { headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getPersonalInfo);
export const PUT = withErrorHandling(updatePersonalInfo);