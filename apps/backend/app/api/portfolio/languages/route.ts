import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getLanguages() {
  const languages = await prisma.language.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(languages, { headers: corsHeaders });
}

async function createLanguage(request: NextRequest) {
  const body = await request.json();

  const language = await prisma.language.create({
    data: body,
  });

  return NextResponse.json(language, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getLanguages);
export const POST = withErrorHandling(createLanguage);