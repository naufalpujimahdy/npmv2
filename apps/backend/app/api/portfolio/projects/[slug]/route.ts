import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getProject(request: NextRequest, { params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return NextResponse.json(
      { ok: false, error: "Project not found" },
      { status: 404, headers: corsHeaders(request) }
    );
  }

  return NextResponse.json({ ok: true, data: project }, { headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getProject);