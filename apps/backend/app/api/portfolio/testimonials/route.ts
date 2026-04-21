import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getTestimonials(request: NextRequest) {
  const testimonials = await prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ ok: true, data: testimonials }, { headers: corsHeaders(request) });
}

async function createTestimonial(request: NextRequest) {
  const body = await request.json();

  const testimonial = await prisma.testimonial.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: testimonial }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getTestimonials);
export const POST = withErrorHandling(createTestimonial);