"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { FaCalendarDays } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditDyeingCard from "./EditDyeingCard";
import { EditGrayPayment } from "@/app/(main)/components/gray/EditGrayPayment";
import PaymentForm from "@/app/(main)/components/form/PaymentForm";
import {
  useDyeingPaymentMutation,
  useToggleDyeingChalanMarkedByIdMutation,
} from "@/features/dyeing/dyeingApi";
import { EditDyeingPayment } from "./EditDyeingPayment";
import Swal from "sweetalert2";
import Link from "next/link";
import { FaRunning } from "react-icons/fa";
import { numberToFixed, productStatus } from "../helper";
import UpdateDyeingModal from "./UpdateDyeingModal";
import { TbCoinTakaFilled, TbCurrencyTaka } from "react-icons/tb";

export default function DyeingCard({ data }) {
  const [addPayment, { isLoading }] = useDyeingPaymentMutation();
  const totalCost = data?.products.reduce((sum, product) => {
    return sum + (product?.dyeing_amount * product?.dyeing_rate || 0);
  }, 0);

  const [toggleMakrked] = useToggleDyeingChalanMarkedByIdMutation();

  const totalPayment =
    data?.payments?.reduce((sum, payment) => {
      return sum + payment?.amount;
    }, 0) || 0;

  const totalDue = totalCost - totalPayment;

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
    <Card className="h-full  min-w-[600px] shadow-md">
      <CardHeader className="bg-slate-200/60 rounded-t-md py-4">
        <CardTitle className="flex gap-5 justify-between items-center text-xl">
          <span className="text-base flex gap-2 items-center">
            <FaCalendarDays />
            {data?.date ? format(parseISO(data?.date), "d MMMM  yyyy") : " "}
          </span>
          <div className="flex items-center gap-2">
            <UpdateDyeingModal data={data} />
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
                  type="add"
                  setOpen={setOpen}
                  data={{
                    chalanId: data?.id,
                    dyeingId: data?.dyeingId,
                  }}
                  addPayment={addPayment}
                  isLoading={isLoading}
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
          <ResizablePanel defaultSize={60} className="pr-5" minSize={35}>
            <div className="left space-y-4 w-full  ">
              {data?.products?.map((product) => (
                <div
                  className="bg-green-50/80  space-y-1.5 p-2 border rounded-md shadow-[4px_4px_2px_1px__#eee]"
                  key={product?.id}
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
                  <p className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1">
                    <span>Receive From Dyeing</span>
                    <span>
                      {product?.dyeing_date
                        ? format(parseISO(product?.dyeing_date), "d MMM  yyyy")
                        : " "}
                    </span>
                  </p>
                  <p className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1">
                    <span>Gray Order</span>
                    <span>{product?.gray_amount}</span>
                  </p>
                  <p className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1">
                    <span>Dyeing Amount</span>
                    <span>{product?.dyeing_amount}</span>
                  </p>
                  <p className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1 ">
                    <span>Difference</span>
                    <span>
                      {product?.gray_amount && product?.dyeing_amount
                        ? numberToFixed(
                            +(product?.gray_amount - product?.dyeing_amount)
                          )
                        : null}
                    </span>
                  </p>
                  <p className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1">
                    <span>Dyeing Rate</span>
                    <span>{product?.dyeing_rate}</span>
                  </p>

                  <p className="flex justify-between items-center text-[15px] px-2 rounded-md bg-white py-1 ">
                    <span>Finished Product</span>
                    <span>
                      {product?.finished_products?.reduce((sum, product) => {
                        return sum + product?.amount;
                      }, 0)}
                    </span>
                  </p>
                </div>
              ))}

              {data?.products?.length ? (
                <>
                  <hr />
                  <div className="px-2">
                    <p className="flex justify-between gap-4 items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-semibold flex items-center ">
                        {numberToFixed(+totalCost)}
                        <TbCurrencyTaka className="text-xl font-thin text-gray-500" />
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} className="pl-5" minSize={35}>
            <div className="space-y-3">
              {/* payments */}
              {data?.payments?.map((payment, index) => (
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
                      <EditDyeingPayment payment={payment} due={totalDue} />
                    </div>
                    <span className="text-slate-500 flex items-center gap-1">
                      {numberToFixed(+payment?.amount)}
                      <TbCoinTakaFilled className="text-lg mt-[2px]" />
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
                      {totalPayment}
                      <TbCoinTakaFilled className="text-lg mt-[2px]" />
                    </span>
                  </p>
                  {data?.discount ? (
                    <div className="flex justify-between items-center pb-3">
                      <p className="flex gap-2 items-center font-medium">
                        <span>Discount</span>
                      </p>
                      <span className="text-red-500 flex items-center">
                        -{numberToFixed(data?.discount)}
                        <TbCoinTakaFilled className="text-lg mt-[2px]" />
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
                    <span className="text-red-500 flex items-center">
                      {numberToFixed(+totalDue)}
                      <TbCoinTakaFilled className="text-lg mt-[2px]" />
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
