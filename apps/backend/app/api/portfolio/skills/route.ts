import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getSkills() {
  const skills = await prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(skills, { headers: corsHeaders });
}

async function createSkill(request: NextRequest) {
  const body = await request.json();

  const skill = await prisma.skill.create({
    data: body,
  });

  return NextResponse.json(skill, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getSkills);
export const POST = withErrorHandling(createSkill);