"use client";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCustomerChalanByIdQuery,
  useGetCustomerPaymentByIdQuery,
} from "@/features/customers/customerApi";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";

import { format } from "date-fns";
import SingleMemo from "../../components/memo/SingleMemo";

export default function SingleMemoPage({ params }) {
  const { id } = params;
  const { data: { data: chalan = {} } = {}, isLoading } =
    useGetCustomerChalanByIdQuery(id);

  const products =
    chalan?.customerProducts?.map((product) => {
      return {
        id: product?.product?.id,
        name: product?.product?.name,
        sellRate: product?.product_rate,
        items: product?.finishedProducts?.map((item) => item),
      };
    }) || [];

  const {
    data: { data: chalanPayment = {} } = {},
    isLoading: isPaymentLoading,
  } = useGetCustomerPaymentByIdQuery(chalan?.paymentWithPurchaseId);

  if (isLoading || isPaymentLoading) {
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
            <Link
              className="transition-colors hover:text-slate-950"
              href={"/memo"}
            >
              Memo
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">
              {chalan?.customer?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h2 className=" pt-6 pb-4 text-[22px] sm:text-2xl  md:text-3xl font-bold tracking-tight text-center uppercase">
        Messers rizvi enterprise
      </h2>
      <h3 className="text-xl pb-2 font-semibold text-center">Cash Memo</h3>

      {/* memo  */}
      <div className="max-w-[1100px] mx-auto pb-12">
        <hr />
        {/* memo details  */}
        <div className="py-4 flex justify-between items-center flex-wrap  gap-x-10 gap-y-2">
          <p>
            <span className="border font-medium  h-8 inline-flex items-end justify-center bg-slate-200 px-2 py-1.5 text-sm rounded-l-md">
              Memo no.
            </span>
            <span className="border  h-8 inline-flex items-end justify-center w-20 bg-slate-50 px-2 py-1.5 text-sm rounded-r-md">
              {chalan?.id}
            </span>
          </p>
          <p className="flex items-center">
            <span className="border uppercase  font-medium   h-8 inline-flex items-end justify-center bg-slate-200 px-3 py-1.5 text-[12px] rounded-l-md">
              Date
            </span>
            <span className="border  h-8 inline-flex items-end justify-center  bg-slate-50 px-2 py-1.5 text-sm rounded-r-md">
              {format(new Date(chalan?.date), "dd MMM yyyy")}
            </span>
          </p>
        </div>
        {/* customer information  */}
        <div className="py-4">
          <div className="flex items-center">
            <span className="border h-[38px]  font-semibold rounded-l-md inline-flex justify-center items-center  px-4">
              Name
            </span>
            <Input
              className="   focus-visible:ring-0 rounded-r-md disabled:border-slate-300 rounded-l-none focus-visible:ring-offset-0 focus:border-slate-400/80"
              placeholder="Enter customer name"
              type="text"
              disabled={true}
              value={chalan?.customer?.name}
            />
          </div>
          <div className="flex gap-4 items-center  pt-4">
            <div className="flex items-center w-full">
              <Label className="border h-[40px] font-semibold rounded-l-md inline-flex justify-center items-center  px-4">
                Address
              </Label>
              <Input
                className="   focus-visible:ring-0 rounded-r-md disabled:border-slate-300 rounded-l-none focus-visible:ring-offset-0 focus:border-slate-400/80"
                placeholder="Enter customer address"
                type="text"
                disabled={true}
                value={chalan?.customer?.address}
              />
            </div>
            <div className="flex items-center w-full">
              <Label className="border h-[40px] font-semibold rounded-l-md inline-flex justify-center items-center  px-4">
                Phone
              </Label>
              <Input
                className="   focus-visible:ring-0 rounded-r-md disabled:border-slate-300 rounded-l-none focus-visible:ring-offset-0 focus:border-slate-400/80"
                placeholder="Enter customer phone"
                type="text"
                disabled={true}
                value={chalan?.customer?.phone}
              />
            </div>
          </div>
        </div>
        <SingleMemo
          payment={chalanPayment}
          products={products}
          customer={{
            ...chalan?.customer,
            chalanId: chalan?.id,
          }}
          chalan={{
            id: chalan.id,
            ...chalan,
          }}
        />
      </div>
    </div>
  );
}
