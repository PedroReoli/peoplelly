import * as z from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
    username: z.string().min(2, { message: 'O nome de usuário deve ter pelo menos 2 caracteres' }),
    email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido' }),
    password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
});
export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  });