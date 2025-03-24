import { z } from "zod";
import { dyeingPaymentSchema, grayPaymentSchema } from "./payment.schema";
// import graySchema from "./gray.schema";

export const productSchema = z.object({
  id: z.number(),
  name: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be string",
    })
    .min(2, "Product name must be at least 2 character"),

  // gray
  // gray : graySchema,
  grayId: z
    .number({
      required_error: "Gray id is required.",
      invalid_type_error: "Gray id must be number",
    })
    .min(1, "Gray id must be at least 1 character"),
  gray_amount: z
    .number({
      required_error: "Gray amount is required.",
      invalid_type_error: "Gray amount must be number",
    })
    .min(1, "Gray amount must be at least 1 character"),
  gray_rate: z
    .number({
      required_error: "Gray rate is required.",
      invalid_type_error: "Gray rate must be number",
    })
    .min(1, "Gray rate must be at least 1 character"),
  gray_date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
      "Invalid ISO 8601 date format"
    )
    .optional(),
  gray_payment_status: z
    .boolean({
      invalid_type_error: "Gray payment status must be boolean",
    })
    .default(false),
  gray_payments: grayPaymentSchema.optional(),

  // dyeing
  // dyeing: dyeingSchema.optional(),
  dyeingId: z
    .number({
      invalid_type_error: "Dyeing id must be number",
    })
    .min(1, "Dyeing id must be at least 1 character")
    .optional(),
  dyeingChalanId: z
    .number({
      invalid_type_error: "Dyeing chalan id must be number",
    })
    .min(1, "Dyeing chalan id must be at least 1 character")
    .optional(),
  dyeing_rate: z
    .number({
      invalid_type_error: "Dyeing rate must be number",
    })
    .optional(),
  dyeing_date: z
    .date({
      invalid_type_error: "Dyeing date must be date type",
    })
    .optional(),
  thaan_amount: z
    .number({
      invalid_type_error: "Thaan amount must be number",
    })
    .min(1, "Thaan amount must be at least 1 character")
    .optional(),
  // thaan_count:
  dyeing_payment_status: z
    .boolean({
      invalid_type_error: "Dyeing payment status must be boolean",
    })
    .default(false),
  dyeing_payments: dyeingPaymentSchema.optional(),

  // chalan
  chalanId: z
    .number({
      invalid_type_error: "Chalan id must be number",
    })
    .min(1, "Chalan id  must be at least 1 character")
    .optional(),
  //   chalan: z.object().optional(),
  // delivery
  delivery_status: z.enum(["IN_MILL", "IN_HOUSE", "RUNNING"]).optional(),
});

// export
export default productSchema;
