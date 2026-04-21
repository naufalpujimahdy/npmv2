import { NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import { withErrorHandling } from "@/src/lib/error-handler";
import { corsHeaders, handleCorsPreFlight } from "@/src/lib/cors";
import { projectSchema } from "@/src/lib/portfolio-validation";

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const includeHidden = searchParams.get("include_hidden") === "true";

    const where: any = includeHidden ? {} : { isVisible: true };
    if (featured === "true") {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    // Kembalikan dalam format [data, options]
    return [projects, { status: 200, headers: corsHeaders(request) }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();
    const validated = projectSchema.parse(body);
    
    const project = await prisma.project.create({
      data: {
        ...validated,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
      },
    });

    return [project, { status: 201, headers: corsHeaders(request) }];
  });
}

export function OPTIONS(request: Request) {
  const corsPreFlight = handleCorsPreFlight(request);
  if (corsPreFlight) return corsPreFlight;
  return new Response(null, { status: 204 });
}