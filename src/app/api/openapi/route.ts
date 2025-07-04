import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';

export async function GET() {
  try {
    const yamlFile = readFileSync(
      join(process.cwd(), 'src/lib/api/openapi.yaml'),
      'utf8'
    );
    
    const openApiSpec = yaml.parse(yamlFile);
    
    // Update server URL based on environment
    if (process.env.NODE_ENV === 'production') {
      openApiSpec.servers[0].url = process.env.NEXT_PUBLIC_APP_URL + '/api';
    }
    
    return NextResponse.json(openApiSpec);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load API documentation' },
      { status: 500 }
    );
  }
}