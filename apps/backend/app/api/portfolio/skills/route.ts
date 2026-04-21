import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getSkills(request: NextRequest) {
  const skills = await prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: skills }, { headers: corsHeaders(request) });
}

async function createSkill(request: NextRequest) {
  const body = await request.json();

  const skill = await prisma.skill.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: skill }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getSkills);
export const POST = withErrorHandling(createSkill);