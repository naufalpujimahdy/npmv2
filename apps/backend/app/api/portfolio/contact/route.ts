import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getContactMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages, { headers: corsHeaders });
}

async function createContactMessage(request: NextRequest) {
  const body = await request.json();

  const message = await prisma.contactMessage.create({
    data: body,
  });

  return NextResponse.json(message, { status: 201, headers: corsHeaders });
}

export const GET = withErrorHandling(getContactMessages);
export const POST = withErrorHandling(createContactMessage);