import { ApiReference } from '@scalar/nextjs-api-reference';

export const GET = ApiReference({
  spec: {
    // This is the URL our OpenAPI spec is served from
    url: '/api/doc',
  },
});
