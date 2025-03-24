"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useAddCustomerMutation,
  useUpdateCustomerByIdMutation,
} from "@/features/customers/customerApi";
import SubmitLoader from "../SubmitLoader";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Customer name is required",
      invalid_type_error: "Customer name must be string",
    })
    .min(3, "Customer name must be at least 3 character"),
  address: z
    .string({
      required_error: "Customer address is required.",
      invalid_type_error: "Customer address must be string",
    })
    .min(3, "Customer address must be at least 3 character"),
  phone: z
    .string({
      required_error: "Customer phone number is required.",
      invalid_type_error: "Customer phone must be string.",
    })
    .min(8, "Customer phone number must be at least 8 character"),
});

export default function CustomerForm({ type = "add", formData = {}, setOpen }) {
  const [updateCustomer, { isLoading: isUpdateLoading }] =
    useUpdateCustomerByIdMutation();
  const [addCustomer, { isLoading }] = useAddCustomerMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "update" ? formData?.name : "",
      address: type === "update" ? formData?.address : "",
      phone: type === "update" ? formData?.phone : "",
    },
  });

  const onSubmit = async (values) => {
    // for update form
    if (type === "update") {
      const res = await updateCustomer({
        id: formData.id,
        data: values,
      });
      if (res.data?.success) {
        toast.success(res.data?.message);
        setOpen && setOpen(false);
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
    // for edit form
    else if (type === "add") {
      const res = await addCustomer(values);
      if (res.data?.success) {
        form.reset();
        setOpen && setOpen(false);
        toast.success(res.data?.message);
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter Customer name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Address</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter customer address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Phone </FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter customer phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {type === "update" ? (
            <Button type="submit">
              <SubmitLoader label={"Update"} loading={isUpdateLoading} />
            </Button>
          ) : (
            <Button type="submit">
              <SubmitLoader label={"Submit"} loading={isLoading} />
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
