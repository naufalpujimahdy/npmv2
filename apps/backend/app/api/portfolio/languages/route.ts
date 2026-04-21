import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getLanguages(request: NextRequest) {
  const languages = await prisma.language.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: languages }, { headers: corsHeaders(request) });
}

async function createLanguage(request: NextRequest) {
  const body = await request.json();

  const language = await prisma.language.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: language }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getLanguages);
export const POST = withErrorHandling(createLanguage);