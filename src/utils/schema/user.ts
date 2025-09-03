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

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type signUpValues = z.infer<typeof signUpSchema>;
export type signInValues = z.infer<typeof signInSchema>;
export type resetPasswordValues = z.infer<typeof resetPasswordSchema>;
