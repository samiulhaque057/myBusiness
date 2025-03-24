"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  useGetAllCustomerChalanQuery,
  useGetAllCustomersQuery,
} from "@/features/customers/customerApi";
import { format, parse } from "date-fns";
import Link from "next/link";
import { useState } from "react";

import CreatableSelect from "react-select/creatable";

import BuyProduct from "../components/memo/card/BuyProduct";
import SelectedProduct from "../components/memo/card/SelectedProduct";
import CountCost from "../components/memo/card/CountCost";
import PaymentCount from "../components/memo/card/PaymentCount";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";

export default function Memo() {
  const { data: { data: customers = [] } = {}, isLoading } =
    useGetAllCustomersQuery();

  const { data: { data: customersChalan = [] } = {}, refetch } =
    useGetAllCustomerChalanQuery();

  const lastChalanId = [...customersChalan]?.sort((a, b) => b.id - a.id)[0]?.id;

  // customers names
  const customerNames = customers.map((customer) => ({
    value: customer.name,
    label: customer.name,
    id: customer.id,
  }));

  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    beforeData: false, // for auto get address and phone from name
    id: "",
  });

  const [allSelectedProducts, setAllSelectedProducts] = useState([]);
  const [payment, setPayment] = useState(null);

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
            <BreadcrumbLink className="text-black">Memo</BreadcrumbLink>
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
              {lastChalanId ? lastChalanId + 1 : 1}
            </span>
          </p>
          <p className="flex items-center">
            <span className="border uppercase  font-medium   h-8 inline-flex items-end justify-center bg-slate-200 px-3 py-1.5 text-[12px] rounded-l-md">
              Date
            </span>
            <span className="border  h-8 inline-flex items-end justify-center  bg-slate-50 px-2 py-1.5 text-sm rounded-r-md">
              {format(new Date(), "dd MMM yyyy")}
            </span>
          </p>
        </div>
        {/* customer information  */}
        <div className="py-4">
          <div className="flex items-center">
            <span className="border h-[38px]  font-semibold rounded-l-md inline-flex justify-center items-center  px-4">
              Name
            </span>

            <CreatableSelect
              isClearable
              options={customerNames}
              className="w-full rounded-none"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? "#a9b5c6" : "#e2e8f0",
                  borderRadius: "0 6px 6px 0",
                  ":hover": {
                    borderColor: state.isFocused ? "#a9b5c6" : "#e2e8f0",
                  },
                }),
              }}
              onChange={(value) => {
                console.log(value);

                const customer =
                  value?.value &&
                  customers?.find((item) => item.id === value.id);

                if (!value?.value) {
                  setCustomer({
                    name: "",
                    address: "",
                    phone: "",
                    id: "",
                    beforeData: false,
                  });
                } else if (customer && value.value) {
                  setCustomer({
                    name: value.value,
                    address: customer.address,
                    phone: customer.phone,
                    id: customer.id,
                    beforeData: true,
                  });
                } else {
                  setCustomer((prev) => ({ ...prev, name: value?.value }));
                }
              }}
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
                disabled={customer?.beforeData}
                onChange={(e) =>
                  setCustomer((prev) => ({ ...prev, address: e.target.value }))
                }
                value={customer?.address}
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
                disabled={customer?.beforeData}
                onChange={(e) =>
                  setCustomer((prev) => ({ ...prev, phone: e.target.value }))
                }
                value={customer?.phone}
              />
            </div>
          </div>
        </div>

        {/* products */}
        <div className="py-4">
          <Card>
            <CardContent className="p-0">
              <ResizablePanelGroup
                direction="horizontal"
                className="max-w-full rounded-lg"
              >
                <ResizablePanel defaultSize={50} minSize={30} className="pb-3 ">
                  <div className="w-full ">
                    <h2 className="text-xl font-medium bg-slate-100 text-center py-2">
                      Products
                    </h2>
                    <div
                      className={` ${
                        allSelectedProducts?.length
                          ? "justify-between"
                          : " justify-center"
                      } px-3 py-4 flex gap-6 `}
                    >
                      <div>
                        {/* if product found add button show up  */}
                        <div
                          className={
                            allSelectedProducts.length ? "pb-3" : "hidden"
                          }
                        >
                          <BuyProduct
                            setAllSelectedProducts={setAllSelectedProducts}
                            allSelectedProducts={allSelectedProducts}
                          />
                        </div>
                        <div
                          className=" flex justify-between items-center  gap-x-6 gap-y-8 w-full
                      "
                        >
                          {/* products  */}
                          <div className=" flex-1 ">
                            <SelectedProduct
                              allSelectedProducts={allSelectedProducts}
                              setAllSelectedProducts={setAllSelectedProducts}
                            />
                            {!allSelectedProducts?.length && (
                              <p className=" text-red-500 py-3 text-center">
                                No product selected
                              </p>
                            )}
                          </div>
                          <div
                            className={
                              allSelectedProducts.length ? "hidden" : ""
                            }
                          >
                            <BuyProduct
                              setAllSelectedProducts={setAllSelectedProducts}
                              allSelectedProducts={allSelectedProducts}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} className="pb-3">
                  <div className="w-full">
                    <h2 className="text-xl font-medium bg-slate-100 text-center py-2">
                      Count
                    </h2>
                    <div className="px-3 py-4 flex flex-col gap-6 justify-between">
                      <CountCost allSelectedProducts={allSelectedProducts} />
                      <div>
                        <PaymentCount
                          allSelectedProducts={allSelectedProducts}
                          setPayment={setPayment}
                          payment={payment}
                          customer={customer}
                          setCustomer={setCustomer}
                          refetch={refetch}
                          setAllSelectedProducts={setAllSelectedProducts}
                        />
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
