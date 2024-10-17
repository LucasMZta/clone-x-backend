import slug from "slug";
import { z } from "zod";

export const addTweetSchema = z.object({
   body: z.string({ message: 'Precisa enviar um corpo' }).min(1, 'Precisa conter pelo menos 1 letra'),
   answer: z.string().optional()
})