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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useAddUserMutation,
  useUpdateUserByIdMutation,
} from "@/features/auth/authApi";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string({
      required_error: "User name is required",
      invalid_type_error: "User name must be string",
    })
    .min(3, "User name must be at least 3 character"),
  password: z
    .string({
      required_error: "User password is required",
      invalid_type_error: "User password must be string",
    })
    .min(6, "User password must be at least 6 character"),
  email: z
    .string({
      required_error: "User  email is required.",
      invalid_type_error: "User  email must be string",
    })
    .min(3, "User  email must be at least 3 character"),
  phone: z
    .string({
      required_error: "User phone number is required.",
      invalid_type_error: "User phone must be string.",
    })
    .optional(),
  role: z.string({
    required_error: "User role is required.",
    invalid_type_error: "User role must be string.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender",
    invalid_type_error: "Select a valid",
  }),
});

const updateSchema = formSchema.extend({
  password: z.string().optional(),
});

export default function UserAddForm({ type = "edit", formData = {}, setOpen }) {
  const [addUser, { isLoading }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdateLoading }] =
    useUpdateUserByIdMutation();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(type === "update" ? updateSchema : formSchema),
    defaultValues: {
      name: type === "update" ? formData?.name : "",
      email: type === "update" ? formData?.email : "",
      password: "",
      phone: type === "update" ? formData?.phone || "" : "",
      role: type === "update" ? formData?.role : "",
      gender: type === "update" ? formData?.gender : "",
    },
  });

  const onSubmit = async (values) => {
    // remove empty fields
    Object.keys(values).forEach(
      (key) => values[key] === "" && delete values[key]
    );

    if (type === "edit") {
      const res = await addUser(values);
      if (res.data?.success) {
        setOpen && setOpen(false);
        form.reset();
        toast.success(res.data?.message);
      } else {
        toast.error(res?.error?.data?.error?.message);
      }
    } else if (type === "update") {
      const res = await updateUser({
        id: formData.id,
        ...values,
      });
      if (res.data?.success) {
        setOpen && setOpen(false);
        form.reset();
        toast.success(res.data?.message);
      } else {
        toast.error(res?.error?.data?.error?.message);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter user name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Email</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    type="email"
                    placeholder="Enter user email"
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
                <FormLabel>User Password</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    type="password"
                    placeholder="Enter user password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center gap-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Phone </FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter user phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "edit" && (
            <Button type="submit">
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Add User
                </span>
              ) : (
                "Add User"
              )}
            </Button>
          )}
          {type === "update" && (
            <Button type="submit">
              {isUpdateLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Update User
                </span>
              ) : (
                "Update User"
              )}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
