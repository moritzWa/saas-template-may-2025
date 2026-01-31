import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import mongoose from 'mongoose';
import { publicProcedure, router } from './trpc.ts';
import { addCorsHeaders, corsHeaders } from './utils/cors.ts';
import { handleStripeWebhook } from './webhooks/stripe.ts';
import { handleTestRoutes } from './routes/test.ts';

// Export tRPC utilities
export { publicProcedure, router };

// Import routers
import { authRouter } from './routers/auth.ts';
import { paymentsRouter } from './routers/payments.ts';

// Create app router
export const appRouter = router({
  auth: authRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;

// MongoDB connection
const MONGODB_URI = Deno.env.get('MONGODB_URI') || 'mongodb://localhost:27017/PROJECT_NAME';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: unknown) => console.error('MongoDB connection error:', error));

// Start server
const PORT = parseInt(Deno.env.get('PORT') || '8000');

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);
  const origin = req.headers.get('origin') || undefined;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Stripe webhook
  if (req.method === 'POST' && url.pathname === '/api/webhooks/stripe') {
    return handleStripeWebhook(req, origin);
  }

  // Sitemap
  if (req.method === 'GET' && url.pathname === '/sitemap.xml') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://PROJECT_CLIENT_DOMAIN/</loc>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
</urlset>`;
    return addCorsHeaders(
      new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } }),
      origin
    );
  }

  // Test routes (remove in production)
  if (url.pathname.startsWith('/test/')) {
    const testResponse = await handleTestRoutes(req, url.pathname, origin);
    if (testResponse) return testResponse;
  }

  // tRPC handler
  if (url.pathname.startsWith('/trpc')) {
    const response = await fetchRequestHandler({
      endpoint: '/trpc',
      req,
      router: appRouter,
      createContext: () => ({}),
      onError({ error, path }: { error: Error; path: string | undefined }) {
        console.error(`Error in tRPC path ${path}:`, error);
      },
    });
    return addCorsHeaders(response, origin);
  }

  return addCorsHeaders(new Response('Not Found', { status: 404 }), origin);
});

console.log(`Server running on port ${PORT}`);
