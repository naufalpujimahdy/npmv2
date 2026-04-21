import { NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { educationSchema } from "@/src/lib/portfolio-validation";

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("include_hidden") === "true";

    const education = await prisma.education.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: "asc" },
    });

    // Cukup kembalikan array [data, options]
    return [education, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();

    // Validasi Zod otomatis ditangani oleh withErrorHandling
    const validated = educationSchema.parse(body);
    
    const education = await prisma.education.create({
      data: validated,
    });

    return [education, { status: 201 }];
  });
}