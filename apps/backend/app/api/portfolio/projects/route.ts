import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { projectSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getProjects(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const includeHidden = searchParams.get("include_hidden") === "true";

  const where: any = includeHidden ? {} : { isVisible: true };
  if (featured === "true") {
    where.featured = true;
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: projects }, { headers: corsHeaders(request) });
}

async function createProject(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = projectSchema.parse(body);
    const project = await prisma.project.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: project }, { status: 201, headers: corsHeaders(request) });
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

export const GET = withErrorHandling(getProjects);
export const POST = withErrorHandling(createProject);