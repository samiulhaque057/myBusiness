import { z } from "zod";

const graySchema = z.object({
  id: z.number(),
  name: z
    .string({
      required_error: "Gray name is required",
      invalid_type_error: "Gray name must be string",
    })
    .min(3, "Gray name must be at least 3 character"),
  address: z
    .string({
      required_error: "Gray address is required.",
      invalid_type_error: "Gray address must be string",
    })
    .min(3, "Gray address must be at least 3 character"),
  phone: z
    .string({
      required_error: "Gray phone number is required.",
      invalid_type_error: "Gray name must be string.",
    })
    .min(8, "Gray phone number must be at least 3 character"),
  // products: productSchema.optional(),
});

export default graySchema;
