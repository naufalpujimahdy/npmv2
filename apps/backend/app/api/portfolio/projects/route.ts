import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(projects, { headers: corsHeaders });
}

async function getProjectBySlug(request: NextRequest, { params }: { params: { slug: string } }) {
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

async function createProject(request: NextRequest) {
  const body = await request.json();

  const project = await prisma.project.create({
    data: body,
  });

  return NextResponse.json(project, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getProjects);
export const POST = withErrorHandling(createProject);