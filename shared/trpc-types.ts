// Auto-generated tRPC types for client consumption
// This file mirrors the server's router structure without requiring Deno or mongoose

import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { User } from './types';

// Initialize tRPC for type inference
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// Define input/output schemas matching the server

// Auth router types
const googleLoginInput = z.object({ credential: z.string() });
const googleLoginOutput = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    picture: z.string().nullable().optional(),
  }),
});

const waitlistInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  workEmail: z.string().email(),
  useCase: z.string().optional(),
  token: z.string(),
});

const getUserInput = z.object({ token: z.string() });
const exportUsageInput = z.object({ token: z.string() });
const refreshTokenInput = z.object({ refreshToken: z.string() });

// Documents router types
const listDocsInput = z.object({ token: z.string(), limit: z.number().optional() });
const getDocInput = z.object({ token: z.string(), id: z.string() });
const createDocInput = z.object({ token: z.string(), title: z.string().optional() });
const updateDocInput = z.object({
  token: z.string(),
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
});
const deleteDocInput = z.object({ token: z.string(), id: z.string() });

// Payments router types
const checkoutInput = z.object({ token: z.string() });
const portalInput = z.object({ token: z.string() });

// Define the router shape for type inference
const authRouter = router({
  googleLogin: publicProcedure.input(googleLoginInput).mutation(() => ({} as z.infer<typeof googleLoginOutput>)),
  submitWaitlistForm: publicProcedure.input(waitlistInput).mutation(() => ({ success: true })),
  getUser: publicProcedure.input(getUserInput).query(() => ({} as User)),
  checkAndIncrementExportUsage: publicProcedure.input(exportUsageInput).mutation(() => ({
    canExport: true as boolean,
    message: undefined as string | undefined,
    currentUsage: undefined as number | undefined,
    limit: undefined as number | undefined,
  })),
  refreshToken: publicProcedure.input(refreshTokenInput).mutation(() => ({ accessToken: '' })),
});

const documentsRouter = router({
  list: publicProcedure.input(listDocsInput).query(() => [] as Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }>),
  get: publicProcedure.input(getDocInput).query(() => ({
    id: '',
    title: '',
    content: '',
    createdAt: '',
    updatedAt: '',
  })),
  create: publicProcedure.input(createDocInput).mutation(() => ({
    id: '',
    title: '',
    content: '',
    createdAt: '',
    updatedAt: '',
  })),
  update: publicProcedure.input(updateDocInput).mutation(() => ({
    id: '',
    title: '',
    content: '',
    createdAt: '',
    updatedAt: '',
  })),
  delete: publicProcedure.input(deleteDocInput).mutation(() => ({ success: true })),
});

const paymentsRouter = router({
  createCheckoutSession: publicProcedure.input(checkoutInput).mutation(() => ({
    url: null as string | null,
  })),
  createPortalSession: publicProcedure.input(portalInput).mutation(() => ({
    url: '',
  })),
});

// Create the app router for type inference
const appRouter = router({
  auth: authRouter,
  documents: documentsRouter,
  payments: paymentsRouter,
});

// Export the AppRouter type
export type AppRouter = typeof appRouter;
