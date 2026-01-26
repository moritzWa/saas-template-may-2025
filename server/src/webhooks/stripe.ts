import Stripe from 'stripe';
import { User as UserModel } from '../models/user.ts';
import { addCorsHeaders } from '../utils/cors.ts';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      httpClient: Stripe.createFetchHttpClient(),
    })
  : null;

export async function handleStripeWebhook(req: Request, origin?: string): Promise<Response> {
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

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
  try {
    const rawBody = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
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

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await UserModel.findOne({ stripeCustomerId: customerId });
      if (user) {
        if (subscription.cancel_at_period_end && subscription.current_period_end) {
          // Set to cancel at period end - keep subscription active but store end date
          user.subscriptionEndsAt = new Date(subscription.current_period_end * 1000);
          await user.save();
          console.log('Subscription set to cancel on:', user.subscriptionEndsAt, 'for:', user.email);
        } else if (subscription.status === 'active' && !subscription.cancel_at_period_end) {
          // Reactivated or renewed - clear the end date
          user.hasSubscription = true;
          user.subscriptionEndsAt = undefined;
          await user.save();
          console.log('Subscription active for:', user.email);
        }
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
