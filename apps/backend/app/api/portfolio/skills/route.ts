import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { skillSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getSkills(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const includeHidden = searchParams.get("include_hidden") === "true";

  const where: any = includeHidden ? {} : { isVisible: true };
  if (category) {
    where.category = category;
  }

  const skills = await prisma.skill.findMany({
    where,
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: skills }, { headers: corsHeaders(request) });
}

async function createSkill(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = skillSchema.parse(body);
    const skill = await prisma.skill.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: skill }, { status: 201, headers: corsHeaders(request) });
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

export const GET = withErrorHandling(getSkills);
export const POST = withErrorHandling(createSkill);