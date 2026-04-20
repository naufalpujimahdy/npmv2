import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getProject(request: NextRequest, { params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json(project, { headers: corsHeaders });
}

export const GET = withErrorHandling(getProject);