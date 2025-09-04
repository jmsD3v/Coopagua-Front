import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';
import spec from '@/../next-swagger-doc.js';

export async function GET() {
  return NextResponse.json(createSwaggerSpec(spec));
}
