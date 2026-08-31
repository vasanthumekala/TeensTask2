import { z } from "zod";

const emailSchema = z.email({ error: "Invalid email format" });
const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .regex(/^[\p{L}\s.'’-]+$/u, {
      message: "Name must contain only letters and valid spacing",
    }),
  email: emailSchema,
  password: passwordSchema,
  role: z
    .enum(["admin", "manager", "employee"], {
      message: "Invalid role",
    })
    .default("employee"),
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});
