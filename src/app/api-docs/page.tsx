'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
        <div className="bg-white rounded-lg shadow-lg">
          <SwaggerUI url="/api/openapi" />
        </div>
      </div>
    </div>
  );
}