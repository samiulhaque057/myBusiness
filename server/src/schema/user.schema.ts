import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({
      message: "Enter a valid email adddress",
    }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(5, "Password must be at least 5 characters"),
  gender: z.enum(["male", "female"]),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "MODERATOR"]).default("MODERATOR"),
});

export default userSchema;
