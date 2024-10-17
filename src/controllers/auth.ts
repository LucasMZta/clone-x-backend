import { RequestHandler } from "express";
import { signUpSchema } from "../schemas/signup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signInSchema } from "../schemas/signin";

export const signUp: RequestHandler = async (req, res) => {
   //validar os dados recebidos
   const safeData = signUpSchema.safeParse(req.body);
   if (!safeData.success) {
      res.json({ error: safeData.error.flatten().fieldErrors });
      return;
   }
   //se existe algum usuario com esse email enviado
   const hasEmail = await findUserByEmail(safeData.data.email);
   if (hasEmail) {
      res.json({ error: 'E-mail já cadastrado' });
      return;
   }

   //verificar slug
   let genSlug = true;
   let userSlug = slug(safeData.data.name).replace('-', '.');
   while (genSlug) {
      const hasSlug = await findUserBySlug(userSlug);
      if (hasSlug) {
         let slugSuffix = Math.floor(Math.random() * 9999).toString();
         userSlug = slug(safeData.data.name + slugSuffix).replace('-', '.');
      } else {
         genSlug = false;
      }
   }

   //gerar hash de senha
   const hashPassword = await hash(safeData.data.password, 10);

   //cria o usuario
   const newUser = await createUser({
      slug: userSlug,
      name: safeData.data.name,
      email: safeData.data.email,
      password: hashPassword
   });

   //cria o token de acesso
   const token = createJWT(newUser.slug);

   //retorna o resultado (token, user)
   res.status(201).json({
      token,
      user: {
         name: newUser.name,
         slug: newUser.slug,
         avatar: newUser.avatar
      }
   });
}

export const signIn: RequestHandler = async (req, res) => {
   //verificar as info que o user mandar (email e senha)
   const safeData = signInSchema.safeParse(req.body);
   if (!safeData.success) {
      res.json({ error: safeData.error.flatten().fieldErrors });
      return;
   }
   //verifica se existe um usuario com aquele email
   const user = await findUserByEmail(safeData.data.email);
   if (!user) {
      res.status(401).json({ error: 'Dados incorretos! Verifique novamente.' });
      return;
   }
   //verifica a senha com o hash do BD e o hash que ele digita
   const verifyPass = await compare(safeData.data.password, user.password);
   if (!verifyPass) {
      res.status(401).json({ error: 'Dados incorretos! Verifique novamente.' });
      return;
   }
   //cria o token e devolve as informações para o usuario
   const token = createJWT(user.slug);

   res.json({
      token,
      user: {
         name: user.name,
         slug: user.slug,
         avatar: user.avatar
      }
   });
}