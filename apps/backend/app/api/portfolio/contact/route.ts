import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";
import { contactMessageSchema } from "@/src/lib/portfolio-validation";
import { z } from "zod";

async function getContactMessages(request: NextRequest) {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ ok: true, data: messages }, { headers: corsHeaders(request) });
}

async function createContactMessage(request: NextRequest) {
  const body = await request.json();

  try {
    const validated = contactMessageSchema.parse(body);
    const message = await prisma.contactMessage.create({
      data: validated,
    });

    return NextResponse.json({ ok: true, data: message }, { status: 201, headers: corsHeaders(request) });
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

export const GET = withErrorHandling(getContactMessages);
export const POST = withErrorHandling(createContactMessage);