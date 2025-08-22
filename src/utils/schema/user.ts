import { sign } from "crypto";
import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});

export type signUpValues = z.infer<typeof signUpSchema>;
export type signInValues = z.infer<typeof signInSchema>;
