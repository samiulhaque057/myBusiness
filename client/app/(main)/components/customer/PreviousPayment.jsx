"use client";
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
import { format, formatISO } from "date-fns";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { toast } from "react-toastify";
import SubmitLoader from "../SubmitLoader";

const paymentAddFSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Payment amount is required",
      invalid_type_error: "Payment amount must be number",
    })
    .min(1, "Payment amount must be at least 1 character"),
  date: z.date({
    required_error: "Payment date is required.",
    invalid_type_error: "Payment date must be date",
  }),
});

const paymentUpdateSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "Payment amount must be number",
    })
    .optional(),
  date: z.date().optional(),
});

export default function PreviousPayment({
  data,
  type = "add",
  beforePaymentData,
  setOpen,
  dueAmount,
  addPayment,
  updatePayemnt,
  isLoading,
}) {
  const form = useForm({
    resolver: zodResolver(
      type === "update" ? paymentUpdateSchema : paymentAddFSchema
    ),
    defaultValues: {
      amount: type === "update" ? beforePaymentData?.amount : 0,
      date: type === "update" ? new Date(beforePaymentData?.date) : new Date(),
    },
  });

  const onSubmit = async (values) => {
    if (String(dueAmount) && values?.amount > dueAmount) {
      return toast.error("Payment amount can't be greater than due amount");
    }

    if (type === "update") {
      const paymentData = {
        id: beforePaymentData?.id,
        amount: values?.amount,
        date: formatISO(values?.date),
      };

      const response = await updatePayemnt(paymentData);

      if (response?.data?.success) {
        toast.success("Successfully updated.");
        setOpen(false);
      } else {
        toast.error(response?.error?.data?.error?.message);
      }
    } else if (type === "add") {
      const paymentData = {
        ...data,
        date: formatISO(values?.date),
        amount: values?.amount,
      };

      const response = await addPayment(paymentData);

      if (response?.data?.success) {
        toast.success("Successfully added.");
        setOpen(false);
        form.reset();
      } else {
        toast.error(response?.error?.data?.error?.message);
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount</FormLabel>
              <FormControl>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="Enter payment amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          type="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button className="bg-transparent border hover:bg-black/5 text-black">
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    // disabled={(date) =>
                    //   date > new Date() || date < new Date("1900-01-01")
                    // }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {type === "update" ? (
            <SubmitLoader label={"Update"} loading={isLoading} />
          ) : (
            <SubmitLoader label={"Submit"} loading={isLoading} />
          )}
        </Button>
      </form>
    </Form>
  );
}
