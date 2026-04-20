import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/error-handler";
import { corsHeaders } from "@/lib/cors";

async function getPortfolioSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      category: {
        in: ["general", "seo", "social", "contact"]
      }
    },
  });

  // Convert to key-value object
  const settingsObj: Record<string, any> = {};
  settings.forEach(setting => {
    try {
      settingsObj[setting.key] = JSON.parse(setting.value);
    } catch {
      settingsObj[setting.key] = setting.value;
    }
  });

  return NextResponse.json(settingsObj, { headers: corsHeaders });
}

async function updatePortfolioSettings(request: NextRequest) {
  const body = await request.json();

  const updates = [];
  for (const [key, value] of Object.entries(body)) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key },
        update: {
          value: typeof value === 'string' ? value : JSON.stringify(value)
        },
        create: {
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          category: "general"
        },
      })
    );
  }

  await prisma.$transaction(updates);

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

export const GET = withErrorHandling(getPortfolioSettings);
export const PUT = withErrorHandling(updatePortfolioSettings);