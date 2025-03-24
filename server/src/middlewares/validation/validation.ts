import { z } from "zod";
import userSchema from "../../schema/user.schema";
import graySchema from "../../schema/gray.schema";
import dyeingSchema from "../../schema/dyeing.schema";
import productSchema from "../../schema/product.schema";

export const createUserZodSchema = z.object({
  body: userSchema.omit({
    id: true,
  }),
});

export const loginZodSchema = z.object({
  body: userSchema.pick({
    password: true,
    email: true,
  }),
});

export const forgotPasswordZodSchema = z.object({
  body: userSchema.pick({
    email: true,
  }),
});

export const resetPasswordZodSchema = z.object({
  body: z
    .object({
      code: z
        .string({
          required_error: "Code is required.",
          invalid_type_error: "Code must be string",
        })
        .min(5, "Code must be 5 characters"),
      newPassword: z
        .string({
          required_error: "New password is required.",
        })
        .min(5, "Password must be at least 5 characters"),
      oldPassword: z
        .string({
          required_error: "Old password is required.",
        })
        .min(5, "Password must be at least 5 characters"),
    })
    .refine((data) => {
      if (data.newPassword !== data.oldPassword) return false;
      return true;
    }, "New password and Old password doesn't match."),
});

// gray
export const createGrayZodSchema = z.object({
  body: graySchema.omit({
    id: true,
  }),
});

// dyeing
export const createDyeingZodSchema = z.object({
  body: dyeingSchema.omit({
    id: true,
  }),
});

// product
export const createProductZodSchema = z.object({
  body: productSchema.omit({
    id: true,
  }),
});

// product add to dyeing
export const productAddToDyeingZodSchema = z.object({
  body: productSchema
    .pick({
      dyeing_date: true,
      dyeing_rate: true,
      thaan_amount: true,
    })
    .extend({
      productId: z.number({
        required_error: "Product id is required",
        invalid_type_error: "Product id must be number",
      }),
      dyeingId: z.number({
        required_error: "Dyeing id is required",
        invalid_type_error: "Dyeing id must be number",
      }),
    }),
});
