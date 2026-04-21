import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getCertifications(request: NextRequest) {
  const certifications = await prisma.certification.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: certifications }, { headers: corsHeaders(request) });
}

async function createCertification(request: NextRequest) {
  const body = await request.json();

  const certification = await prisma.certification.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: certification }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getCertifications);
export const POST = withErrorHandling(createCertification);