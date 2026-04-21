import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { experienceSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getExperience(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("include_hidden") === "true";

  const experiences = await prisma.experience.findMany({
    where: includeHidden ? {} : { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: experiences }, { headers: corsHeaders(request) });
}

async function createExperience(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = experienceSchema.parse(body);
    const experience = await prisma.experience.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: experience }, { status: 201, headers: corsHeaders(request) });
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

export const GET = withErrorHandling(getExperience);
export const POST = withErrorHandling(createExperience);