import { z } from 'zod';
import { registerSchema } from '../../auth/dto/register.dto';

export const updateUserSchema = registerSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
