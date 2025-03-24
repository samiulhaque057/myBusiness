"use client";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";
import PageTitle from "@/components/PageTitle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import CheckCard from "../components/check/CheckCard";
import { useGetAllCustomerCheckQuery } from "@/features/customers/customerApi";

export default function Check() {
  const isLoading = false;

  const { data: { data: customerChecks = [] } = {} } =
    useGetAllCustomerCheckQuery();

  const processData = customerChecks?.map((dt, index) => {
    return {
      ...dt,
      index: index + 1,
      customer_name: dt?.customer?.name,
    };
  });

  return (
    <div className=" px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3  lg:py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="transition-colors hover:text-slate-950" href={"/"}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">Check</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ElahiVorsa />

      <PageTitle title={"All Customer Bank Check"} />

      <CheckCard data={processData || []} isLoading={isLoading} />
    </div>
  );
}
