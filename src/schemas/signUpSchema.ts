import { z } from "zod";
export const usernameValidation = z
  .string()
  .min(5, "Username must be atleast 5 character")
  .max(20, "Username must be no more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: z.string().min(6, "Password must be atleast 6 characters"),
});
