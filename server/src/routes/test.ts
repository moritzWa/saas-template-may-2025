// Test routes - remove in production
import { User as UserModel } from '../models/user.ts';
import { addCorsHeaders } from '../utils/cors.ts';

export async function handleTestRoutes(
  req: Request,
  pathname: string,
  origin?: string
): Promise<Response | null> {
  if (pathname === '/test/create-user' && req.method === 'POST') {
    try {
      const body = await req.json();
      const user = await UserModel.create({
        email: body.email || `test-${Date.now()}@example.com`,
        name: body.name || 'Test User',
        googleId: `test-${Date.now()}`,
      });
      return addCorsHeaders(
        new Response(
          JSON.stringify({ success: true, user: { id: user._id, email: user.email, name: user.name } }),
          { headers: { 'Content-Type': 'application/json' } }
        ),
        origin
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return addCorsHeaders(
        new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    }
  }

  if (pathname === '/test/delete-user' && req.method === 'POST') {
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
        new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    }
  }

  if (pathname === '/test/list-users' && req.method === 'GET') {
    try {
      const users = await UserModel.find({})
        .select('_id email name hasSubscription subscriptionEndsAt stripeCustomerId')
        .limit(10);
      return addCorsHeaders(
        new Response(JSON.stringify({ users }), {
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return addCorsHeaders(
        new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    }
  }

  if (pathname === '/test/activate-subscription' && req.method === 'POST') {
    try {
      const body = await req.json();
      const user = await UserModel.findOne({ stripeCustomerId: body.customerId });
      if (user) {
        user.hasSubscription = true;
        await user.save();
        return addCorsHeaders(
          new Response(JSON.stringify({ success: true, email: user.email }), {
            headers: { 'Content-Type': 'application/json' },
          }),
          origin
        );
      }
      return addCorsHeaders(
        new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return addCorsHeaders(
        new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        origin
      );
    }
  }

  // No matching test route
  return null;
}
