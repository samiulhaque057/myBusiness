"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { useGetCustomerByIdQuery } from "@/features/customers/customerApi";
import CustomerCard from "../../../components/customer/CustomerCard";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";
import { DatePickerWithRange } from "@/app/(main)/components/gray/DatePickerWithRange";
import { useState } from "react";
import { addMonths, format, parseISO } from "date-fns";
import { MdOutlinePaid } from "react-icons/md";
import { TbCalendarDue, TbCurrencyTaka } from "react-icons/tb";
import {
  totalSingleCustomerCost,
  totalSingleCustomerDiscount,
  totalSingleCustomerPaid,
} from "../../../components/customer/customer.helper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CustomerPaymentTable from "../../../components/customer/CustomerPaymentTable";
import { numberToFixed } from "@/app/(main)/components/helper";

export default function SingleCustomer({ params }) {
  const { id } = params;

  const [date, setDate] = useState({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });

  const from =
    date?.from &&
    format(parseISO(new Date(date?.from)?.toISOString()), "yyyy-MM-dd");
  const to =
    date?.to &&
    format(parseISO(new Date(date?.to)?.toISOString()), "yyyy-MM-dd");

  const eql = !to && from;

  const query =
    from && to && from !== to
      ? `?date[gte]=${from}&date[lte]=${to}`
      : eql
      ? `&date[eq]=${eql}`
      : from && from === to
      ? `&date[eq]=${from}`
      : "";

  const { data: { data: customer = {} } = {}, isLoading } =
    useGetCustomerByIdQuery(`${id}?${query}`);

  const totalCost = totalSingleCustomerCost(customer);
  const totalPaid = totalSingleCustomerPaid(customer);
  const totalDiscount = totalSingleCustomerDiscount(customer);
  console.log(totalCost);

  const totalDue = (totalCost && totalCost - (totalPaid + totalDiscount)) || 0;

  // customer payments
  const customerPayments = customer?.customerPayments || [];
  const payments = [...customerPayments]
    ?.sort((a, b) => new Date(b?.date) - new Date(a?.date))
    .map((payment, index) => {
      return {
        index: index,
        date: format(parseISO(payment?.date), "d MMM  yyyy"),
        payment: payment?.amount,
        chalanId: payment?.chalanId,
        id: payment?.id,
        isPreviousPayment: payment?.isPreviousPayment,
      };
    });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <Skeleton className="h-[30px] w-[300px] rounded-md" />
        <div className="mx-auto pt-6 space-y-2">
          <Skeleton className="h-[20px] w-full rounded-md" />
          <Skeleton className="h-[20px] w-full rounded-md" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3  lg:py-4">
      <Breadcrumb className="">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="transition-colors hover:text-slate-950" href={"/"}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              className="transition-colors hover:text-slate-950"
              href={"/customers/all"}
            >
              All Customers
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">
              {customer?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ElahiVorsa />

      {/* customer information */}
      <div className="w-full  rounded-md pt-8 px-4 pb-5">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          {customer?.name}
        </h2>
        <div className="flex items-center justify-center gap-6 pt-2">
          <p className="flex items-center gap-2">
            <span className="font-semibold flex items-center gap-2">
              <IoLocationOutline />
              <span>Address :</span>
            </span>
            <span className="text-sm">{customer?.address}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold flex gap-2 items-center">
              <FiPhone /> <span>Phone:</span>
            </span>
            <span className="text-sm">{customer?.phone}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold flex gap-2 items-center">
              <MdOutlinePaid /> <span>Paid:</span>
            </span>
            <span className="text-sm flex items-center">
              {numberToFixed(totalPaid)}
              <TbCurrencyTaka className="text-xl font-thin text-gray-500" />
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold flex gap-2 items-center">
              <TbCalendarDue /> <span>Due:</span>
            </span>
            <span className="text-sm flex items-center">
              {numberToFixed(totalDue)}
              <TbCurrencyTaka className="text-xl font-thin text-gray-500" />
            </span>
          </p>
        </div>
      </div>

      {/* chalans and payments */}
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg"
      >
        <ResizablePanel defaultSize={65} className="pr-5">
          {/* date picker */}
          <div className="py-3">
            <DatePickerWithRange setDate={setDate} date={date} />
          </div>

          {/* chalan data */}
          <div className="flex gap-6 flex-wrap pb-16">
            {customer?.chalans?.map((chalan) => (
              <CustomerCard key={chalan?.id} chalan={chalan} />
            ))}
            {customer.chalans?.length === 0 && (
              <div
                className="text-center text-lg
          font-semibold w-full py-10 text-red-500"
              >
                Couldn&apos;t find any chalan data
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* payment  */}
        <ResizablePanel defaultSize={35} className="pl-5">
          <h3 className="text-center py-2 text-2xl font-medium text-slate-700">
            Payments
          </h3>

          <CustomerPaymentTable
            data={payments}
            customer={{
              customerId: customer?.id,
            }}
            dueAmount={totalDue}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
