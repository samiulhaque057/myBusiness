"use client";

import { RxCross2 } from "react-icons/rx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, parse, parseISO } from "date-fns";
import { useState } from "react";
import PaymentForm from "@/app/(main)/components/form/PaymentForm";
import {
  useCustomerChalanPaymentMutation,
  useToggleCustomerChalanMarkedByIdMutation,
} from "@/features/customers/customerApi";
import { EditCustomerPayment } from "./EditCustomerPayment";
import Swal from "sweetalert2";

export default function CustomerCard({ chalan }) {
  const totalChalanProductCost = chalan?.customerProducts?.reduce(
    (sum, product) => {
      const totalAmount = product?.finishedProducts?.reduce(
        (acc, item) => acc + item?.amount,
        0
      );
      return sum + product?.product_rate * totalAmount;
    },
    0
  );

  const totalChalanPayment = chalan?.payments?.reduce(
    (acc, payment) => acc + payment?.amount,
    0
  );

  const totalDue =
    totalChalanProductCost - totalChalanPayment - chalan?.discount;

  const [addPayment, { isLoading }] = useCustomerChalanPaymentMutation();
  const [toggleMakrked] = useToggleCustomerChalanMarkedByIdMutation();

  // toggle marked paid
  const toggleMarkedPaid = async () => {
    const updateData = {
      id: chalan.id,
      markedPaid: !chalan?.markedPaid,
      discount: chalan?.markedPaid ? 0 : totalDue,
    };

    if (chalan?.markedPaid) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "If you mark unpaid, discount will be removed",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, do it!",
      });
      if (result?.isConfirmed) {
        const res = await toggleMakrked(updateData);

        if (res?.data?.success) {
          Swal.fire(
            "Success!",
            "Customer payment  has been marked unpaid.",
            "success"
          );
        } else {
          Swal.fire({
            title: "Failed",
            text: res?.error?.data?.error?.message,
            icon: "error",
          });
        }
      }
    } else {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "If you mark paid, rest of the due will be discount",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, do it!",
      });

      if (result?.isConfirmed) {
        const res = await toggleMakrked(updateData);

        if (res?.data?.success) {
          Swal.fire(
            "Success!",
            "Customer payment  has been marked unpaid.",
            "success"
          );
        } else {
          Swal.fire({
            title: "Failed",
            text: res?.error?.data?.error?.message,
            icon: "error",
          });
        }
      }
    }
  };

  const [open, setOpen] = useState();

  return (
    <Card className="h-full  min-w-[600px]  border">
      <CardHeader className="bg-slate-200/60 rounded-t-md py-4">
        <CardTitle className="flex gap-5 justify-between items-center text-xl ">
          <span className="text-base">
            {chalan?.date &&
              format(
                parse(chalan?.date, "yyyy-MM-dd", new Date()),
                "d MMMM yyyy"
              )}
          </span>
          <div className="flex gap-2 items-center ">
            <Link
              href={`/memo/${chalan.id}`}
              className=" border rounded-md text-[12px] px-3 bg-black/10 hover:bg-black/15   h-fit w-fit"
            >
              Edit
            </Link>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                className="bg-black/10 disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:text-slate-500 disabled:hover:text-slate-500 rounded-md text-black text-[12px] border hover:bg-black/15 hover:text-black h-8 px-2"
                // disabled={totalCost ? false : true}
              >
                Add Payment
              </DialogTrigger>
              <DialogContent className="overflow-scroll ">
                <DialogHeader>
                  <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                    Add Payment
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <PaymentForm
                  setOpen={setOpen}
                  type="add"
                  addPayment={addPayment}
                  dueAmount={totalDue}
                  isLoading={isLoading}
                  data={{
                    customerId: chalan?.customerId,
                    customerChalanId: chalan?.customerProducts[0]?.chalanId,
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 bg-[#fff] ">
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-full rounded-lg"
        >
          <ResizablePanel defaultSize={40} className="pr-5" minSize={35}>
            <div className="space-y-2">
              {/* payments */}
              {[...chalan?.payments]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((payment, index) => (
                  <div
                    className="flex justify-between group show-edit relative bg-slate-100 px-2 rounded-md py-1"
                    key={payment.id}
                  >
                    <p className="flex items-center">
                      <span className="font-medium mr-1">{index + 1}.</span>
                      <span className="text-sm">
                        &nbsp;
                        {format(parseISO(payment?.date), "d MMM  yyyy")}
                      </span>
                    </p>
                    <div className="font-medium flex gap-3  items-center">
                      <div className=" invisible   group-hover:visible ">
                        <EditCustomerPayment payment={payment} due={totalDue} />
                      </div>
                      <span className="text-slate-500">{payment?.amount}</span>
                    </div>
                  </div>
                ))}

              {/* divider  */}
              {chalan?.payments?.length ? <hr /> : ""}

              {/* total  payment and due  */}
              {totalChalanPayment ? (
                <div className="text-slate-700">
                  <p className="flex justify-between items-center py-3 font-semibold">
                    <span>Total Payment</span>
                    <span className=" font-medium">{totalChalanPayment}</span>
                  </p>
                  {chalan?.discount ? (
                    <div className="flex justify-between items-center pb-3">
                      <p className="flex gap-2 items-center font-medium">
                        <span>Discount</span>
                      </p>
                      <span className="text-red-500">-{chalan?.discount}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex justify-between items-center pb-3">
                    <p className="flex gap-2 items-center font-medium">
                      <span>Due</span>
                      {chalan?.markedPaid ? (
                        <Button
                          className="text-[12px] bg-red-100 py-1 text-black border hover:bg-red-200 hover:text-black h-fit px-2"
                          onClick={toggleMarkedPaid}
                        >
                          Mark Unpaid
                        </Button>
                      ) : (
                        <Button
                          onClick={toggleMarkedPaid}
                          className="text-[12px] bg-black/5 py-1 text-black border hover:bg-black/10 hover:text-black h-fit px-2"
                        >
                          Mark Paid
                        </Button>
                      )}
                    </p>
                    <span className="text-red-500">{totalDue}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500 py-4 text-center">
                  No Payment Found
                </p>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} className="pr-5 pl-10" minSize={35}>
            <div className="left space-y-4 w-full  ">
              {chalan?.customerProducts?.map((product) => {
                const totalAmount = product?.finishedProducts?.reduce(
                  (acc, item) => acc + item?.amount,
                  0
                );

                return (
                  <div
                    className="bg-slate-100/80 p-2 border rounded-md shadow-[4px_4px_2px_1px__#eee] space-y-1"
                    key={product?.id}
                  >
                    <p className="text-lg font-semibold px-2 py-1 rounded-md">
                      <Link href={`/products/all/${product?.product?.id}`}>
                        {product?.product?.name}
                      </Link>
                    </p>
                    <p className="flex justify-between items-center  px-2 rounded-md py-1">
                      <span>{totalAmount}</span>
                      <span>
                        <RxCross2 />
                      </span>
                      <span>{product?.product_rate}</span>
                      <span>=</span>
                      <span>{product?.product_rate * totalAmount}</span>
                    </p>
                  </div>
                );
              })}

              <div>
                <hr />
              </div>
              <div className="">
                <p className="flex justify-between gap-4 items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-semibold">
                    {totalChalanProductCost}
                  </span>
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
