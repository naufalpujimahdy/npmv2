import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { testimonialSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getTestimonials(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("include_hidden") === "true";

  const testimonials = await prisma.testimonial.findMany({
    where: includeHidden ? {} : { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: testimonials }, { headers: corsHeaders(request) });
}

async function createTestimonial(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = testimonialSchema.parse(body);
    const testimonial = await prisma.testimonial.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: testimonial }, { status: 201, headers: corsHeaders(request) });
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

export const GET = withErrorHandling(getTestimonials);
export const POST = withErrorHandling(createTestimonial);