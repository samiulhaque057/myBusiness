import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
} from "@/features/customers/customerApi";

import {
  useConfirmPurchaseMutation,
  useGetAllProductsQuery,
  useUpdateConfirmPurchaseMutation,
} from "@/features/products/productApi";
import { format } from "date-fns";
import React, { useState } from "react";
import { CiSquareRemove } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function PaymentCount({
  allSelectedProducts,
  payment,
  setPayment,
  customer,
  setAllSelectedProducts,
  setCustomer,
  type,
  refetch,
  chalan,
}) {
  const totalCost = allSelectedProducts?.reduce((acc, product) => {
    acc += product?.items?.reduce((acc, item) => {
      acc += item.amount * product?.sellRate;
      return acc;
    }, 0);
    return acc;
  }, 0);

  // customers data refetch after product purchase
  const { refetch: refetchCustomers } = useGetAllCustomersQuery(
    `?date[eq]=${format(new Date(), "yyyy-MM-dd")}`
  );

  const [isMarkedPaid, setIsMarkedPaid] = useState(
    type === "update" ? chalan?.markedPaid : false
  );
  const [discount, setDiscount] = useState(
    type === "update" ? chalan?.discount : 0
  );

  const totalDue = totalCost
    ? totalCost - (payment?.amount || 0) - discount
    : 0;

  const [open, setOpen] = React.useState(false);
  const [confirmPurchase, { isLoading: confirmLoading }] =
    useConfirmPurchaseMutation();

  const [updatePurchase] = useUpdateConfirmPurchaseMutation();

  // payment
  const handlePayment = (e) => {
    e.preventDefault();

    const amount = e.target.amount.value;
    if (!amount) return toast.error("Payment amount is required");

    if (amount > totalCost)
      return toast.error("Payment amount is greater than price.");

    setPayment({
      amount: +amount,
    });

    setOpen(false);
  };

  // handle payement remove
  const handlePaymentRemove = () => {
    setPayment({});
  };

  // handle confirm parchase
  const handleConfirmPurchase = async () => {
    const { name, address, phone } = customer;

    // verrify customer data
    if (!name) return toast.error("Customer name is required!");
    if (!address) return toast.error("Customer address is required!");
    if (!phone) return toast.error("Customer phone is required!");

    // verify product data
    if (!allSelectedProducts.length)
      return toast.error("Please select product!");

    const data = {
      customer: {
        ...customer,
        discount,
        markedPaid: isMarkedPaid,
      },
      products: allSelectedProducts,
      payment,
    };

    if (type === "update") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Update the purchase.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result?.isConfirmed) {
        const res = await updatePurchase({
          id: data?.customer?.chalanId,
          data,
        });
        if (res?.data?.success) {
          refetch && refetch();
          refetchCustomers();
          Swal.fire("Success!", "Successfully product sell.", "success");
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
        text: "Confirm the purchase.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, purchase it!",
      });

      if (result?.isConfirmed) {
        const res = await confirmPurchase(data);
        refetch();
        refetchCustomers();
        if (res?.data?.success) {
          setPayment({});
          setAllSelectedProducts([]);
          setCustomer &&
            setCustomer({
              name: "",
              address: "",
              phone: "",
            });

          Swal.fire("Success!", "Data saved.", "success");
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

  // toggle marked paid
  const toggleMarkedPaid = async () => {
    if (isMarkedPaid) {
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
        setIsMarkedPaid(!isMarkedPaid);
        setDiscount(0);

        if (true) {
          Swal.fire(
            "Success!",
            "Customer payment  has been marked unpaid.",
            "success"
          );
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
        setIsMarkedPaid(!isMarkedPaid);
        setDiscount(totalCost - payment.amount);

        if (true) {
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

  return (
    <div className={`${allSelectedProducts?.length ? "" : "hidden"} `}>
      <div className="py-3">
        <div className="px-3 overflow-hidden py-4 border bg-slate-50/40 rounded-md space-y-2 shadow-sm">
          <p className="flex gap-6 justify-between px-3 bg-slate-100 py-2">
            <span className="font-semibold">Total Price</span>
            <span>{(+totalCost).toFixed(2)}</span>
          </p>
          <div className="flex gap-6 px-3 bg-slate-100 justify-between py-2 group ">
            <span className="font-semibold">Paid</span>
            <p className="flex gap-2 items-center ">
              {payment?.amount && (
                <>
                  <span
                    className="h-[26px] invisible group-hover:visible w-[26px] flex justify-center items-center rounded-sm bg-red-100 text-red-500 hover:bg-red-300/50 cursor-pointer "
                    onClick={handlePaymentRemove}
                  >
                    <CiSquareRemove className="text-lg" />
                  </span>
                  <span
                    className="h-[26px] invisible group-hover:visible w-[26px] flex justify-center items-center rounded-sm bg-violet-200 hover:bg-violet-300/70 cursor-pointer  text-violet-700"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <FiEdit />
                  </span>
                </>
              )}
              <span>{payment?.amount ? payment?.amount : 0}</span>
            </p>
          </div>

          {discount && isMarkedPaid ? (
            <div className="flex gap-6 px-3 bg-slate-100 justify-between py-2">
              <p className="flex gap-2 items-center font-medium">
                <span className=" font-medium">Discount</span>
              </p>
              <span className="text-red-500">-{discount}</span>
            </div>
          ) : (
            ""
          )}

          <div className="flex gap-6 px-3 bg-slate-100 justify-between py-2">
            <p className="flex gap-2 items-center font-medium">
              <span>Due</span>
              {payment?.amount && (
                <>
                  {isMarkedPaid ? (
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
                </>
              )}
            </p>
            <span>{(+totalDue).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className={`flex gap-6 justify-between `}>
        <Dialog open={open} onOpenChange={setOpen} className="">
          <DialogTrigger
            className={`py-2 h-8 rounded-md  items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5    border ${
              payment?.amount ? "hidden" : "flex"
            }`}
          >
            Payment
          </DialogTrigger>
          <DialogContent className="overflow-scroll">
            <DialogHeader>
              <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                {payment?.amount ? " Update Payment" : "Add Payment"}
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePayment}>
              <div className="pb-4">
                <Label className="block py-3">Payment Amount</Label>
                <Input
                  className="   h-10    focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  type="number"
                  name="amount"
                  defaultValue={payment?.amount || ""}
                  placeholder="Enter payment amount"
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          disabled={
            !customer?.name ||
            !customer?.address ||
            !customer?.phone ||
            !allSelectedProducts?.length ||
            !allSelectedProducts?.every((dt) => +dt.sellRate) ||
            !allSelectedProducts?.every((dt) => dt.items?.length)
          }
          onClick={handleConfirmPurchase}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
