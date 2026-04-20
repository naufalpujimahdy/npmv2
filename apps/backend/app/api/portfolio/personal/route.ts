import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getPersonalInfo() {
  const personalInfo = await prisma.personalInfo.findFirst();

  if (!personalInfo) {
    return NextResponse.json(
      { error: "Personal info not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json(personalInfo, { headers: corsHeaders });
}

async function updatePersonalInfo(request: NextRequest) {
  const body = await request.json();

  const personalInfo = await prisma.personalInfo.upsert({
    where: { email: body.email },
    update: body,
    create: body,
  });

  return NextResponse.json(personalInfo, { headers: corsHeaders });
}

export const GET = withErrorHandling(getPersonalInfo);
export const PUT = withErrorHandling(updatePersonalInfo);