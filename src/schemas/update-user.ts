import { z } from "zod";

export const updateUserSchema = z.object({
   name: z.string().min(2, 'Precisa ter no mínimo dois ou mais caracteres').optional(),
   bio: z.string().optional(),
   link: z.string().url('Precisa ser uma URL válida').optional()
});