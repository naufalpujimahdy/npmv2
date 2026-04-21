import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { languageSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getLanguages(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("include_hidden") === "true";

  const languages = await prisma.language.findMany({
    where: includeHidden ? {} : { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: languages }, { headers: corsHeaders(request) });
}

async function createLanguage(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = languageSchema.parse(body);
    const language = await prisma.language.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: language }, { status: 201, headers: corsHeaders(request) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: error.errors },
        { status: 400, headers: corsHeaders(request) }
      );
    }
    throw error;
  }
}

export const GET = withErrorHandling(getLanguages);
export const POST = withErrorHandling(createLanguage);