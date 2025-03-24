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

import { useAddGrayMutation } from "@/features/gray/grayApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const formSchema = z.object({
  email: z.string().email("Enter valid email address"),
  password: z
    .string({
      required_error: "Gray address is required.",
      invalid_type_error: "Gray address must be string",
    })
    .min(3, "Gray address must be at least 3 character"),
});

export default function LoginForm({ type = "edit", formData = {}, setOpen }) {
  const [show, setShow] = useState(false);

  const [addGray, { isLoading, isSuccess, error, isError, data }] =
    useAddGrayMutation();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await addGray(values);
    if (res.data?.success) {
      form.reset();
      toast.success(res.data?.message);
    } else if (!res?.error?.data?.success) {
      toast.error(res?.error?.data?.error?.message);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Your Email</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Your Password </FormLabel>
                <FormControl className="group relative">
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    onClick={() => setShow(!show)}
                    className="absolute top-4 right-0"
                  >
                    {show ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit"> {isLoading ? "Loading" : "Submit"} </Button>
        </form>
      </Form>
    </>
  );
}
