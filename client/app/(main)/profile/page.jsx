"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  useLoggedInUserQuery,
  useUpdateUserByIdMutation,
} from "@/features/auth/authApi";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import PasswordChange from "./PasswordChange";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserByIdMutation();
  const { data: { data: user = {} } = {}, isLoading } = useLoggedInUserQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const { name, phone } = data;

    if (!phone) delete data.phone;

    if (!name) toast.error("User name is required");

    const response = await updateProfile({
      id: user?.id,
      ...data,
    });

    if (response?.data?.success) {
      toast.success("User profile updated successfully");
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  if (isLoading || !user.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3  lg:py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="transition-colors hover:text-slate-950" href={"/"}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">{user?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-6">
        <div className="mt-6">
          <h1 className="text-2xl font-semibold pb-4 text-center">
            User Profile
          </h1>
          <div className="max-w-[550px] mx-auto bg-slate-100/50 p-4 rounded-md">
            <div className="">
              <Image
                src={"/user.png"}
                alt={user?.name}
                width={64}
                height={64}
                className="w-full h-full max-w-[200px] max-h-[200px] rounded-md mx-auto"
              />
            </div>
            <div className="py-6 ">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="block pb-3">Username</Label>
                  <Input
                    className="   focus-visible:ring-0 text-slate-700 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    name="name"
                    defaultValue={user?.name}
                    placeholder="Enter user name"
                  />
                </div>
                <div className="py-3">
                  <Label className="block pb-3">User Email</Label>
                  <Input
                    className="   focus-visible:ring-0 text-slate-700 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    defaultValue={user?.email}
                    disabled={true}
                    name="email"
                    type="email"
                    placeholder="Enter user email"
                  />
                </div>
                <div className="py-3">
                  <Label className="block pb-3">User Phone</Label>
                  <Input
                    className="   focus-visible:ring-0 text-slate-700 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    defaultValue={user?.phone}
                    name="phone"
                    placeholder="Enter user phone"
                  />
                </div>
                <div className="py-3">
                  <Label className="block pb-3">User Role</Label>
                  <Input
                    className="   focus-visible:ring-0 text-slate-700 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    name="role"
                    defaultValue={user?.role}
                    disabled={true}
                    placeholder="Enter user role"
                  />
                </div>
                <div className="py-3">
                  <Label className="block pb-3">Gender</Label>
                  <Input
                    className="   focus-visible:ring-0 text-slate-700 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    name="gender"
                    defaultValue={user?.gender}
                    disabled={true}
                    placeholder="Enter user gender"
                  />
                </div>

                <div className="flex gap-6 flex-wrap justify-between">
                  <Button type="submit">
                    {isUpdating ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Update Profile
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                  <PasswordChange user={user} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
