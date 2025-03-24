import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LuRotateCw } from "react-icons/lu";
import SubmitLoader from "../SubmitLoader";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaRegEdit } from "react-icons/fa";
import { useUpdatePreviuosDueByIdMutation } from "@/features/customers/customerApi";
import { toast } from "react-toastify";
import { useState } from "react";

const paymentAddFSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Payment amount is required",
      invalid_type_error: "Payment amount must be number",
    })
    .min(1, "Payment amount must be at least 1 character"),
});

export default function EditPreviousDue({ previous, type = "add", data }) {
  const form = useForm({
    resolver: zodResolver(paymentAddFSchema),
    defaultValues: {
      amount: type === "update" ? previous : 0,
    },
  });

  const [updatePayment, { isLoading }] = useUpdatePreviuosDueByIdMutation();

  const [open, setOpen] = useState(false);

  const onSubmit = async (values) => {
    const paymentData = {
      ...data,
      isPreviousPayment: true,
      previousDue: values?.amount,
    };

    const response = await updatePayment({
      id: data?.id,
      data: paymentData,
    });

    if (response?.data?.success) {
      toast.success("Successfully payment.");
      setOpen(false);

      type == "add" ? form.reset() : "";
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 h-8  rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400  border">
        {type === "add" ? <FaRegEdit /> : <LuRotateCw />}
      </DialogTrigger>
      <DialogContent className="overflow-scroll ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            {type === "add" ? "Add" : "Update"} Previous Due
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
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
                  <FormLabel>Amount</FormLabel>
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

            <Button type="submit">
              {type === "update" ? (
                <SubmitLoader label={"Update"} loading={isLoading} />
              ) : (
                <SubmitLoader label={"Submit"} loading={isLoading} />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
