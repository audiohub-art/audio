import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
