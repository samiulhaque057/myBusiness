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

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";

import Cookies from "js-cookie";
import { useAuthLoginMutation } from "@/features/auth/authApi";

const formSchema = z.object({
  email: z.string().email("Enter valid email address"),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Passwrod must be string",
    })
    .min(6, "Password must be at least 6 character"),
});

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const [authLogin, { isLoading }] = useAuthLoginMutation();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await authLogin(values);
    if (res.data?.success) {
      toast.success(res.data?.message);
      Cookies.set("accessToken", res?.data?.data.accessToken, {
        expires: 365,
      });
      router.push("/");
      form.reset();
    } else {
      toast.error(res?.error?.data?.error?.message);
    }
  };

  return (
    <div className="h-screen   flex justify-center  items-center  ">
      <div className="max-w-[500px] w-full    mx-auto border p-6  rounded-md  shadow-xl">
        <h2 className="text-2xl text-center py-4 font-semibold"> Login </h2>
        <div>
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
                    <div className="group relative">
                      <FormControl>
                        <Input
                          className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                          type="password"
                          //   type={show ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        onClick={() => setShow(!show)}
                        className="absolute top-3 right-4 h-fit bg-transparent text-black py-0 px-0 hover:bg-transparent "
                        type="button"
                      >
                        {/* {show ? <IoEyeOffOutline /> : <IoEyeOutline />} */}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submit
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
