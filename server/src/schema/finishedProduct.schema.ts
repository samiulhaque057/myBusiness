import { z } from "zod";

const finishedProductSchema = z.object({
  id: z
    .number({
      required_error: "Finished product id  is required",
      invalid_type_error: "Finished product id must be number",
    })
    .min(1, "Finished id must be at least 1 character"),
  productId: z
    .number({
      required_error: "Product id  is required",
      invalid_type_error: "Product id must be number",
    })
    .min(1, "Product id must be at least 1 character"),
  customerProductId: z
    .number({
      invalid_type_error: "Customer  id must be number",
    })
    .optional(),
  amount: z
    .number({
      required_error: "Thaan amount  is required",
      invalid_type_error: "Thaan amount must be number",
    })
    .min(1, "Thaan amount must be at least 1 character"),
  is_sold: z
    .boolean({
      invalid_type_error: "is_sold must be boolean",
    })
    .default(false),
});

export default finishedProductSchema;
