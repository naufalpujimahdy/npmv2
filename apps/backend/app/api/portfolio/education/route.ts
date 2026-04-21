import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getEducation(request: NextRequest) {
  const education = await prisma.education.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: education }, { headers: corsHeaders(request) });
}

async function createEducation(request: NextRequest) {
  const body = await request.json();

  const education = await prisma.education.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: education }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getEducation);
export const POST = withErrorHandling(createEducation);