import Stripe from 'stripe';
import { z } from 'zod';
import { User as UserModel } from '../models/user.ts';
import { publicProcedure, router } from '../trpc.ts';
import { verifyToken } from './auth.ts';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      httpClient: Stripe.createFetchHttpClient(),
    })
  : null;

const PRICE_ID = Deno.env.get('STRIPE_PRICE_ID') || '';

interface CheckoutSessionResponse {
  url: string | null;
}

interface PortalSessionResponse {
  url: string;
}

export const paymentsRouter = router({
  createCheckoutSession: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }): Promise<CheckoutSessionResponse> => {
      if (!stripe) throw new Error('Stripe not configured');
      try {
        const decoded = verifyToken(input.token);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
          throw new Error('User not found');
        }

        // Create or retrieve Stripe customer
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {
              userId: user.id,
            },
          });
          customerId = customer.id;
          user.stripeCustomerId = customerId;
          await user.save();
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: PRICE_ID,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${Deno.env.get('CLIENT_URL')}/settings?success=true`,
          cancel_url: `${Deno.env.get('CLIENT_URL')}/settings?canceled=true`,
        });

        return { url: session.url };
      } catch (error) {
        console.error('Checkout session error:', error);
        throw new Error('Failed to create checkout session');
      }
    }),

  createPortalSession: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }): Promise<PortalSessionResponse> => {
      if (!stripe) throw new Error('Stripe not configured');
      try {
        const decoded = verifyToken(input.token);
        const user = await UserModel.findById(decoded.userId);

        if (!user || !user.stripeCustomerId) {
          throw new Error('User not found or no Stripe customer ID');
        }

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: `${Deno.env.get('CLIENT_URL')}/settings`,
        });

        return { url: portalSession.url };
      } catch (error) {
        console.error('Portal session error:', error);
        throw new Error('Failed to create portal session');
      }
    }),
});
