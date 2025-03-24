import { z } from "zod";
import dyeingSchema from "./dyeing.schema";
import graySchema from "./gray.schema";

const paymentSchema = z.object({
  id: z.number(),
  date: z.date({
    required_error: "Payment date is required",
    invalid_type_error: "Payment date must be date",
  }),
  amount: z.number({
    required_error: "Payment amount is required.",
    invalid_type_error: "Payment must be number",
  }),
  phone: z.string({
    required_error: "Gray phone number is required.",
    invalid_type_error: "Gray name must be string.",
  }),
});

export default paymentSchema;

// gray payment schema
export const grayPaymentSchema = paymentSchema.extend({
  grayId: z.number({
    required_error: "Gray Id is required.",
    invalid_type_error: "Gray Id must be number",
  }),
  gray: graySchema.optional(),
});

// dyeing payment schema
export const dyeingPaymentSchema = paymentSchema.extend({
  dyeingId: z.number({
    required_error: "Dyeing Id is required.",
    invalid_type_error: "Dyeing Id must be number",
  }),
  dyeing: dyeingSchema.optional(),
});

// customer payment schema
export const customerPaymentSchema = paymentSchema.extend({
  customerId: z.number({
    required_error: "Customer Id is required.",
    invalid_type_error: "Customer Id must be number",
  }),
  // customer
});
