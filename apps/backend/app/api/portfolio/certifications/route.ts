import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders, handleCorsPreFlight } from "@/src/lib/cors";
import { certificationSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getCertifications(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("include_hidden") === "true";

  const certifications = await prisma.certification.findMany({
    where: includeHidden ? {} : { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: certifications }, { headers: corsHeaders(request) });
}

async function createCertification(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = certificationSchema.parse(body);
    const certification = await prisma.certification.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: certification }, { status: 201, headers: corsHeaders(request) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: error.errors },
        { status: 400, headers: corsHeaders(request) }
      );
    }
    throw error;
  }
}

export const GET = withErrorHandling(getCertifications);
export const POST = withErrorHandling(createCertification);

export function OPTIONS(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;
  return new Response(null, { status: 204 });
}