import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(testimonials, { headers: corsHeaders });
}

async function createTestimonial(request: NextRequest) {
  const body = await request.json();

  const testimonial = await prisma.testimonial.create({
    data: body,
  });

  return NextResponse.json(testimonial, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getTestimonials);
export const POST = withErrorHandling(createTestimonial);