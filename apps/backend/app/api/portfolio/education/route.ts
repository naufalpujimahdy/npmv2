import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { educationSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getEducation(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("include_hidden") === "true";

  const education = await prisma.education.findMany({
    where: includeHidden ? {} : { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: education }, { headers: corsHeaders(request) });
}

async function createEducation(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = educationSchema.parse(body);
    const education = await prisma.education.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: education }, { status: 201, headers: corsHeaders(request) });
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

export const GET = withErrorHandling(getEducation);
export const POST = withErrorHandling(createEducation);