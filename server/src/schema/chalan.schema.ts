import { z } from "zod";

const chalanSchema = z.object({
  id: z.number(),
  chalanNumber: z.number({
    required_error: "Chalan id is required",
    invalid_type_error: "Chalan id must be number",
  }),
  productId: z
    .number({
      invalid_type_error: "Product id must be number",
    })
    .optional(),
  //   product: z.object().optional(),
  grayId: z.number({
    required_error: "Gray id is required",
    invalid_type_error: "Gray id must be number",
  }),
  dyeingId: z
    .number({
      invalid_type_error: "Dyeing id must be number",
    })
    .optional(),
});

export default chalanSchema;
