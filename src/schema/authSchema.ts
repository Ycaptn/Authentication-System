import {string, z} from "zod";


export const loginSchema = z.object({
  password: z.string(),
  username: z.string(),
});

export const registerSchema = z.object({
  email: string().email(),
  username: string(),
  password: string()
})

export const resetPasswordSchema = z.object({
  token: string(),
  email: string().email()
})