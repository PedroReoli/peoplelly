import * as z from "zod"

// ============================================================
// USUÁRIO
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  username: z.string().min(2, { message: "O nome de usuário deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Digite um email válido" }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export const SigninValidation = z.object({
  email: z.string()
    .email({ message: "Digite um email válido" })
    .min(1, { message: "Email é obrigatório" }),
  password: z.string()
    .min(1, { message: "Senha é obrigatória" })
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  username: z.string().min(2, { message: "O nome de usuário deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Digite um email válido" }),
  bio: z.string().max(1000, { message: "A biografia deve ter no máximo 1000 caracteres" }),
})

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string()
    .min(5, { message: "A legenda deve ter pelo menos 5 caracteres" })
    .max(2200, { message: "A legenda deve ter no máximo 2.200 caracteres" }),
  file: z.custom<File[]>(),
  location: z.string()
    .min(1, { message: "A localização é obrigatória" })
    .max(1000, { message: "A localização deve ter no máximo 1000 caracteres" }),
  tags: z.string(),
})