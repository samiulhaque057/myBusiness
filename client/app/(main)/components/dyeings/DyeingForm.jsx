"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  useAddDyeingMutation,
  useUpdateDyeingByIdMutation,
} from "@/features/dyeing/dyeingApi";
import SubmitLoader from "../SubmitLoader";

const formSchema = z.object({
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
      invalid_type_error: "Dyeing phone must be string.",
    })
    .min(8, "Dyeing phone must be at least 8 character"),
});

export default function DyeingForm({ type = "add", formData = {}, setOpen }) {
  const [AddDyeing, { isLoading }] = useAddDyeingMutation();
  const [updateDyeing, { isLoading: isUpdateLoading }] =
    useUpdateDyeingByIdMutation();

  // 1. Define your form.
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
      const res = await updateDyeing({
        id: formData.id,
        data: values,
      });

      if (res.data?.success) {
        toast.success("Dyeing updated successfully");
        setOpen && setOpen(false);
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
    // for edit form
    else if (type === "add") {
      const res = await AddDyeing(values);
      if (res.data?.success) {
        setOpen(false);
        form.reset();
        toast.success("Dyeing added successfully.");
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dyeing Name</FormLabel>
              <FormControl>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  placeholder="Enter dyeing name"
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
              <FormLabel>Dyeing Address</FormLabel>
              <FormControl>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  placeholder="Enter dyeing address"
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
              <FormLabel>Dyeing Phone </FormLabel>
              <FormControl>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  placeholder="Enter dyeing phone"
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
  );
}
