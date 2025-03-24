import { z } from "zod";

const dyeingSchema = z.object({
  id: z.number(),
  name: z
    .string({
      required_error: "Dyeing name is required",
      invalid_type_error: "Dyeing name must be string",
    })
    .min(3, "Dyeing name must be at least 3 character"),
  address: z
    .string({
      required_error: "Dyeing address is required.",
      invalid_type_error: "Dyeing address must be string",
    })
    .min(3, "Dyeing address must be at least 3 character"),
  phone: z
    .string({
      required_error: "Dyeing phone number is required.",
      invalid_type_error: "Dyeing name must be string.",
    })
    .min(8, "Dyeing phone must be at least 8 character"),
});

export default dyeingSchema;
