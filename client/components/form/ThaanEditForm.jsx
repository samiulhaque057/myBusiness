import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useUpdateThaanByIdMutation } from "@/features/products/productApi";
import { toast } from "react-toastify";

const formSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Thaan amount  is required",
      invalid_type_error: "Thaan amount must be number",
    })
    .min(2, "Product name must be at least 2 character"),
  defect: z.coerce
    .number({
      invalid_type_error: "Thaan defect must be number",
    })
    .optional(),
});

export default function ThaanEditForm({ thaan, setOpen }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: thaan?.amount,
      defect: thaan?.defect,
    },
  });

  const [updateThaan] = useUpdateThaanByIdMutation();

  const onSubmit = async (values) => {
    const data = {
      ...values,
      id: thaan.id,
    };

    const result = await updateThaan(data);

    if (result?.data?.success) {
      setOpen && setOpen(false);
      toast.success(result?.data?.message);
    } else if (!result?.error?.data?.success) {
      toast.error(result?.error?.data?.error?.message);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thaan Amount</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    type="number"
                    placeholder="Enter thaan amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defect"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defect amount</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    type="number"
                    placeholder="Enter thaan defect"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"> {"Submit"} </Button>
        </form>
      </Form>
    </>
  );
}
