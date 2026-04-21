import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders } from "@/src/lib/cors";

async function getContactMessages(request: NextRequest) {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: messages }, { headers: corsHeaders(request) });
}

async function createContactMessage(request: NextRequest) {
  const body = await request.json();

  const message = await prisma.contactMessage.create({
    data: body,
  });

  return NextResponse.json({ ok: true, data: message }, { status: 201, headers: corsHeaders(request) });
}

export const GET = withErrorHandling(getContactMessages);
export const POST = withErrorHandling(createContactMessage);