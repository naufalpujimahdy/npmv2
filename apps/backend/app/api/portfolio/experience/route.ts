import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getExperience() {
  const experiences = await prisma.experience.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(experiences, { headers: corsHeaders });
}

async function createExperience(request: NextRequest) {
  const body = await request.json();

  const experience = await prisma.experience.create({
    data: body,
  });

  return NextResponse.json(experience, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getExperience);
export const POST = withErrorHandling(createExperience);