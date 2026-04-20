import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getCertifications() {
  const certifications = await prisma.certification.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(certifications, { headers: corsHeaders });
}

async function createCertification(request: NextRequest) {
  const body = await request.json();

  const certification = await prisma.certification.create({
    data: body,
  });

  return NextResponse.json(certification, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getCertifications);
export const POST = withErrorHandling(createCertification);