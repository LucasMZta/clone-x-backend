import { z } from "zod";

export const userTweetSchema = z.object({
   page: z.coerce.number().min(0).optional()
})