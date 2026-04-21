import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getProjects(request: NextRequest) {
  const projects = await prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: projects }, { headers: corsHeaders(request) });
}

async function createProject(request: NextRequest) {
  const body = await request.json();

  const project = await prisma.project.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: project }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getProjects);
export const POST = withErrorHandling(createProject);