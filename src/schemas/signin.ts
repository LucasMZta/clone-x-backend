import { z } from "zod";

export const signInSchema = z.object({
   email: z.string({ message: 'E-mail é obrigatório' }).email('E-mail inválido'),
   password: z.string({ message: 'Senha é obrigatória' }).min(4, 'Precisa ter no mínimo 4 caracteres')
});