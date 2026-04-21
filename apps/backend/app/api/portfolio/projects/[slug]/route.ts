import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  return withErrorHandling(request, async() => {
    const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return NextResponse.json(
      { ok: false, error: "Project not found" },
      { status: 404, headers: corsHeaders(request) }
    );
  }

  return [project, {status: 200}];
  })
}
