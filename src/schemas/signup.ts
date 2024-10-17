import { z } from "zod";

export const signUpSchema = z.object({
   name: z.string({ message: 'Nome é obrigatório' }).min(2, 'Precisa ter no mínimo 2 caracteres'),
   email: z.string({ message: 'E-mail é obrigatório' }).email('E-mail inválido'),
   password: z.string({ message: 'Senha é obrigatória' }).min(4, 'Precisa ter no mínimo 4 caracteres')
});