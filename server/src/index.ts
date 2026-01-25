import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { User as UserModel } from './models/user.ts';
import { publicProcedure, router } from './trpc.ts';

// Export tRPC utilities
export { publicProcedure, router };

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' })
  : null;

// Import routers
import { authRouter } from './routers/auth.ts';
import { paymentsRouter } from './routers/payments.ts';

// Create app router
export const appRouter = router({
  auth: authRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, Accept, stripe-signature',
  'Access-Control-Allow-Credentials': 'true',
};

function addCorsHeaders(response: Response, origin?: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin || '*');
  headers.set('Access-Control-Allow-Credentials', 'true');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// MongoDB connection
const MONGODB_URI = Deno.env.get('MONGODB_URI') || 'mongodb://localhost:27017/PROJECT_NAME';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = parseInt(Deno.env.get('PORT') || '3001');

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);
  const origin = req.headers.get('origin') || undefined;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Stripe webhook - needs raw body
  if (req.method === 'POST' && url.pathname === '/api/webhooks/stripe') {
    if (!stripe) {
      return addCorsHeaders(
        new Response(JSON.stringify({ error: 'Stripe not configured' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    }
    const sig = req.headers.get('stripe-signature');
    if (!sig) {
      return addCorsHeaders(
        new Response(JSON.stringify({ error: 'Missing stripe-signature' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    }

    try {
      const rawBody = await req.text();
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );

      console.log('Webhook received:', event.type);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;

        const user = await UserModel.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.hasSubscription = true;
          await user.save();
          console.log('Subscription activated for:', user.email);
        }
      }

      if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await UserModel.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.hasSubscription = false;
          await user.save();
          console.log('Subscription deactivated for:', user.email);
        }
      }

      return addCorsHeaders(
        new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook error:', message);
      return addCorsHeaders(
        new Response(`Webhook Error: ${message}`, { status: 400 }),
        origin
      );
    }
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
      new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' },
      }),
      origin
    );
  }

  // Test routes (remove in production)
  if (url.pathname === '/test/create-user' && req.method === 'POST') {
    try {
      const body = await req.json();
      const user = await UserModel.create({
        email: body.email || `test-${Date.now()}@example.com`,
        name: body.name || 'Test User',
        googleId: `test-${Date.now()}`,
      });
      return addCorsHeaders(
        new Response(JSON.stringify({ success: true, user: { id: user._id, email: user.email, name: user.name } }), {
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return addCorsHeaders(
        new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } }),
        origin
      );
    }
  }

  if (url.pathname === '/test/delete-user' && req.method === 'POST') {
    try {
      const body = await req.json();
      const result = await UserModel.deleteOne({ _id: body.id });
      return addCorsHeaders(
        new Response(JSON.stringify({ success: true, deleted: result.deletedCount }), {
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return addCorsHeaders(
        new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } }),
        origin
      );
    }
  }

  if (url.pathname === '/test/list-users' && req.method === 'GET') {
    try {
      const users = await UserModel.find({}).select('_id email name').limit(10);
      return addCorsHeaders(
        new Response(JSON.stringify({ users }), {
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return addCorsHeaders(
        new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } }),
        origin
      );
    }
  }

  // tRPC handler
  if (url.pathname.startsWith('/trpc')) {
    const response = await fetchRequestHandler({
      endpoint: '/trpc',
      req,
      router: appRouter,
      createContext: () => ({}),
      onError({ error, path }) {
        console.error(`Error in tRPC path ${path}:`, error);
      },
    });
    return addCorsHeaders(response, origin);
  }

  return addCorsHeaders(new Response('Not Found', { status: 404 }), origin);
});

console.log(`Server running on port ${PORT}`);
