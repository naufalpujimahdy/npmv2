import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getEducation() {
  const education = await prisma.education.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(education, { headers: corsHeaders });
}

async function createEducation(request: NextRequest) {
  const body = await request.json();

  const education = await prisma.education.create({
    data: body,
  });

  return NextResponse.json(education, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getEducation);
export const POST = withErrorHandling(createEducation);