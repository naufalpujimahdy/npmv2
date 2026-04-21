import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getExperience(request: NextRequest) {
  const experiences = await prisma.experience.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: experiences }, { headers: corsHeaders(request) });
}

async function createExperience(request: NextRequest) {
  const body = await request.json();

  const experience = await prisma.experience.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: experience }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getExperience);
export const POST = withErrorHandling(createExperience);