import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import { corsHeaders } from "./cors";
import { ZodSchema } from "zod";

type ModelName = 'experience' | 'education' | 'certification' | 'language' | 'testimonial' | 'project' | 'skill';

interface CrudOptions {
  model: ModelName;
  schema?: ZodSchema;
  includeHiddenParam?: boolean;
}

/**
 * Get all items from a portfolio model
 */
export async function getCrudItems(
  request: NextRequest,
  options: CrudOptions
) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("include_hidden") === "true";

  const where = includeHidden ? {} : { isVisible: true };

  // @ts-ignore - Prisma dynamic model access
  const items = await prisma[options.model].findMany({
    where,
    orderBy: { order: "asc" },
  });

  return [items, { status: 200, headers: corsHeaders(request) }];
}

/**
 * Get a single item by ID
 */
export async function getCrudItem(
  request: NextRequest,
  id: string,
  options: CrudOptions
) {
  // @ts-ignore - Prisma dynamic model access
  const item = await prisma[options.model].findUnique({
    where: { id },
  });

  if (!item) {
    return new NextResponse(
      JSON.stringify({ error: `${options.model} not found` }),
      { status: 404, headers: corsHeaders(request) }
    );
  }

  return new NextResponse(JSON.stringify(item), {
    status: 200,
    headers: corsHeaders(request),
  });
}

/**
 * Create a new item
 */
export async function createCrudItem(
  request: NextRequest,
  options: CrudOptions
) {
  const body = await request.json();

  let validated = body;
  if (options.schema) {
    validated = options.schema.parse(body);
  }

  // Handle date fields
  if (validated.startDate) {
    validated.startDate = new Date(validated.startDate);
  }
  if (validated.endDate && validated.endDate !== null) {
    validated.endDate = new Date(validated.endDate);
  }
  if (validated.issueDate) {
    validated.issueDate = new Date(validated.issueDate);
  }
  if (validated.expiryDate && validated.expiryDate !== null) {
    validated.expiryDate = new Date(validated.expiryDate);
  }

  // @ts-ignore - Prisma dynamic model access
  const item = await prisma[options.model].create({
    data: validated,
  });

  return [item, { status: 201, headers: corsHeaders(request) }];
}

/**
 * Update an item by ID
 */
export async function updateCrudItem(
  request: NextRequest,
  id: string,
  options: CrudOptions
) {
  const body = await request.json();

  let validated = body;
  if (options.schema) {
    validated = options.schema.parse(body);
  }

  // Handle date fields
  if (validated.startDate) {
    validated.startDate = new Date(validated.startDate);
  }
  if (validated.endDate && validated.endDate !== null) {
    validated.endDate = new Date(validated.endDate);
  }
  if (validated.issueDate) {
    validated.issueDate = new Date(validated.issueDate);
  }
  if (validated.expiryDate && validated.expiryDate !== null) {
    validated.expiryDate = new Date(validated.expiryDate);
  }

  // Check if item exists
  // @ts-ignore - Prisma dynamic model access
  const existing = await prisma[options.model].findUnique({
    where: { id },
  });

  if (!existing) {
    return new NextResponse(
      JSON.stringify({ error: `${options.model} not found` }),
      { status: 404, headers: corsHeaders(request) }
    );
  }

  // @ts-ignore - Prisma dynamic model access
  const item = await prisma[options.model].update({
    where: { id },
    data: validated,
  });

  return [item, { status: 200, headers: corsHeaders(request) }];
}

/**
 * Delete an item by ID
 */
export async function deleteCrudItem(
  request: NextRequest,
  id: string,
  options: CrudOptions
) {
  // Check if item exists
  // @ts-ignore - Prisma dynamic model access
  const existing = await prisma[options.model].findUnique({
    where: { id },
  });

  if (!existing) {
    return new NextResponse(
      JSON.stringify({ error: `${options.model} not found` }),
      { status: 404, headers: corsHeaders(request) }
    );
  }

  // @ts-ignore - Prisma dynamic model access
  await prisma[options.model].delete({
    where: { id },
  });

  return [{ success: true }, { status: 200, headers: corsHeaders(request) }];
}
