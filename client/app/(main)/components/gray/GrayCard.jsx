"use client";

import { RxCross2 } from "react-icons/rx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { FaRunning } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EditGrayPayment } from "./EditGrayPayment";
import Link from "next/link";
import PaymentForm from "@/app/(main)/components/form/PaymentForm";
import {
  useGrayPaymentMutation,
  useToggleChalanMarkedByIdMutation,
} from "@/features/gray/grayApi";
import Swal from "sweetalert2";
import { numberToFixed, productStatus } from "@/app/(main)/components/helper";
import { TbCoinTakaFilled } from "react-icons/tb";

export default function GrayCard({ data }) {
  const [addPayment, { isLoading }] = useGrayPaymentMutation();

  const totalCost = data?.products.reduce((sum, product) => {
    return sum + (product?.gray_amount * product?.gray_rate || 0);
  }, 0);

  const totalPayment =
    data?.payments?.reduce((sum, payment) => {
      return sum + payment?.amount;
    }, 0) || 0;

  const totalDue = totalCost - totalPayment - (data?.discount || 0);
  const [toggleMakrked] = useToggleChalanMarkedByIdMutation();

  const [open, setOpen] = useState();

  // toggle marked paid
  const toggleMarkedPaid = async () => {
    const updateData = {
      id: data.id,
      markedPaid: !data?.markedPaid,
      discount: data?.markedPaid ? 0 : totalDue,
    };

    if (data?.markedPaid) {
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
            "Gray payment  has been marked unpaid.",
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
            "Gray payment  has been marked unpaid.",
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

  return (
    <Card className="h-full  min-w-[600px]  shadow-md">
      <CardHeader className="bg-slate-200 rounded-t-md py-4">
        <CardTitle className="flex gap-5 justify-between items-center text-xl">
          <span className="text-base">
            {format(parseISO(data?.date), "d MMMM  yyyy")}
          </span>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-black/10 rounded-md text-black text-[12px] border hover:bg-black/15 hover:text-black h-8 px-2">
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
                type="add"
                setOpen={setOpen}
                data={{ chalanId: data.id, grayId: data.grayId }}
                dueAmount={totalDue}
                isLoading={isLoading}
                addPayment={addPayment}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 bg-[#f8fafc4f]  ">
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-full rounded-lg"
        >
          <ResizablePanel defaultSize={60} className="pr-5" minSize={35}>
            <div className="left space-y-4 w-full">
              {data?.products?.map((product) => (
                <div
                  className="bg-green-50/80 p-2 space-y-1.5 border rounded-md shadow-[4px_4px_2px_1px__#eee]"
                  key={product.id}
                >
                  <p className="text-xl py-1 font-semibold flex justify-between items-center bg-white px-2 rounded-md">
                    <Link href={`/products/all/${product?.id}`}>
                      {product?.name}
                    </Link>
                    <span className="flex gap-2 items-center text-sm text-slate-500 uppercase">
                      <FaRunning />{" "}
                      <span className="text-[12px]">
                        {productStatus(product)}
                      </span>
                    </span>
                  </p>

                  {product?.dyeing?.name ? (
                    <Link
                      href={`/dyeings/all/${product?.dyeing?.id}`}
                      className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1"
                    >
                      <span className="text-slate-700">Dyeing</span>
                      <span className="flex gap-2 items-center text-sm text-slate-600 uppercase">
                        {product?.dyeing?.name}
                      </span>
                    </Link>
                  ) : (
                    ""
                  )}

                  <p className="flex justify-between items-center text-[15px] bg-white px-2 py-1 rounded-md text-slate-600">
                    <span title="Amount">{product?.gray_amount}</span>
                    <span>
                      <RxCross2 />
                    </span>
                    <span title="Rate">{product?.gray_rate}</span>
                    <span>=</span>
                    <span>
                      {numberToFixed(
                        +(product?.gray_amount * product?.gray_rate)
                      )}
                    </span>
                  </p>
                </div>
              ))}

              {data?.products?.length ? (
                <>
                  <hr />
                  <div className="px-4">
                    <p className="flex justify-between gap-4 items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-semibold">{totalCost}</span>
                    </p>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* payment  */}
          <ResizablePanel defaultSize={40} className="pl-5" minSize={35}>
            <div className="space-y-2">
              {/* payments */}
              {[...data?.payments]
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
                        {format(parseISO(payment?.date), "d LLL  yyyy")}
                      </span>
                    </p>
                    <div className="font-medium flex gap-3  items-center">
                      <div className=" invisible   group-hover:visible ">
                        <EditGrayPayment payment={payment} due={totalDue} />
                      </div>
                      <span className="text-slate-500 flex items-center gap-1">
                        <TbCoinTakaFilled className=" mt-[4px]" />
                        {payment?.amount}
                      </span>
                    </div>
                  </div>
                ))}

              {/* divider  */}
              {data?.payments?.length ? <hr /> : ""}

              {/* total  payment and due  */}
              {totalPayment ? (
                <div className="text-slate-700">
                  <p className="flex justify-between items-center py-3 font-semibold">
                    <span>Total Payment</span>
                    <span className=" font-medium flex items-center gap-1">
                      <TbCoinTakaFilled className=" mt-[2px]" />
                      {numberToFixed(totalPayment)}
                    </span>
                  </p>
                  {data?.discount ? (
                    <div className="flex justify-between items-center pb-3">
                      <p className="flex gap-2 items-center font-medium">
                        <span>Discount</span>
                      </p>
                      <span className="text-red-500 flex items-center gap-1">
                        <TbCoinTakaFilled className=" mt-[4px]" />
                        <span>-{numberToFixed(data?.discount)}</span>
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex justify-between items-center pb-3">
                    <p className="flex gap-2 items-center font-medium">
                      <span>Due</span>
                      {data?.markedPaid ? (
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
                    <span className="text-red-500 flex gap-1 items-center">
                      <TbCoinTakaFilled className="text-base mt-[4px]" />
                      {numberToFixed(totalDue)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500 py-4 text-center">
                  No Payment Found
                </p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
