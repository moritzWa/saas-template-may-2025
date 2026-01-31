import { z } from 'zod';
import { Document } from '../models/document.ts';
import { publicProcedure, router } from '../trpc.ts';
import { verifyToken } from './auth.ts';

export const documentsRouter = router({
  list: publicProcedure
    .input(z.object({ token: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const { userId } = verifyToken(input.token);
      const limit = input.limit ?? 50;

      const documents = await Document.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean();

      return documents.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        content: doc.content,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      }));
    }),

  get: publicProcedure
    .input(z.object({ token: z.string(), id: z.string() }))
    .query(async ({ input }) => {
      const { userId } = verifyToken(input.token);

      const doc = await Document.findOne({ _id: input.id, userId }).lean();

      if (!doc) {
        throw new Error('Document not found');
      }

      return {
        id: doc._id.toString(),
        title: doc.title,
        content: doc.content,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    }),

  create: publicProcedure
    .input(z.object({ token: z.string(), title: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { userId } = verifyToken(input.token);

      const doc = await Document.create({
        title: input.title ?? 'Untitled',
        content: '',
        userId,
      });

      return {
        id: doc._id.toString(),
        title: doc.title,
        content: doc.content,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        token: z.string(),
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId } = verifyToken(input.token);

      const updateData: { title?: string; content?: string; updatedAt: Date } = {
        updatedAt: new Date(),
      };

      if (input.title !== undefined) updateData.title = input.title;
      if (input.content !== undefined) updateData.content = input.content;

      const doc = await Document.findOneAndUpdate({ _id: input.id, userId }, updateData, {
        new: true,
      }).lean();

      if (!doc) {
        throw new Error('Document not found');
      }

      return {
        id: doc._id.toString(),
        title: doc.title,
        content: doc.content,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    }),

  delete: publicProcedure
    .input(z.object({ token: z.string(), id: z.string() }))
    .mutation(async ({ input }) => {
      const { userId } = verifyToken(input.token);

      const result = await Document.deleteOne({ _id: input.id, userId });

      if (result.deletedCount === 0) {
        throw new Error('Document not found');
      }

      return { success: true };
    }),
});
