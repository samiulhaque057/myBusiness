import { TbCreditCardPay } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GrayPaymentForm from "../../app/(main)/grays/all/[id]/GrayPaymentForm";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "../ui/button";
import { IoTrashOutline } from "react-icons/io5";
import { useDeleteGrayPaymentByIdMutation } from "@/features/gray/grayApi";
import Swal from "sweetalert2";
import { useState } from "react";
import { useDeleteDyeingPaymentByIdMutation } from "@/features/dyeing/dyeingApi";
import DyeingPaymentForm from "../form/DyeingPaymentForm";

export const TableCell = ({ data, span = 1, style, children }) => {
  return (
    <td
      rowSpan={span}
      className={`${style} px-5 text-nowrap py-3 align-middle [&:has([role=checkbox])]:pr-0 border border-collapse`}
    >
      {data && <div className="">{data}</div>}

      <div>{children}</div>
    </td>
  );
};

export const GivePayment = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-transparent flex gap-2 items-center h-8 px-2 text-sm text-black border hover:bg-black/5">
          <TbCreditCardPay />
          <span>Pay</span>
        </DialogTrigger>
        <DialogContent className="overflow-scroll ">
          <DialogHeader>
            <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
              Payment to Dyer
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DyeingPaymentForm data={data} setOpen={setOpen} />
          {/* <GrayForm /> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EditPayment = ({ payment }) => {
  const [deletePayment] = useDeleteDyeingPaymentByIdMutation();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Dyeing payment will be delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result?.isConfirmed) {
      const res = await deletePayment(id);
      if (res?.data?.success) {
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      } else {
        Swal.fire({
          title: "Failed",
          text: res?.error?.data?.error?.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-1 ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-transparent hover:text-blue-400 rounded-md flex gap-2 items-center  py-1.5 px-1.5 text-sm text-black border hover:bg-black/5">
          <FaRegEdit className="text-[12px]" />
        </DialogTrigger>
        <DialogContent className="overflow-scroll ">
          <DialogHeader>
            <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
              Update Payment
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DyeingPaymentForm
            type="update"
            payment={payment}
            setOpen={setOpen}
          />
          {/* <GrayForm /> */}
        </DialogContent>
      </Dialog>
      <Button
        className=" text-lg   py-1.5 px-1.5 h-fit bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-red-400  border"
        onClick={() => handleDelete(payment.id)}
        disabled={true}
      >
        <IoTrashOutline className="text-[12px]" />
      </Button>
    </div>
  );
};

export default function TableDyeing({ dyeingData }) {
  // product table data
  const productTableData = dyeingData?.products?.reduce((sum, product) => {
    // total gray product cost
    const totalCost = product?.dyeing_amount * product?.dyeing_rate;
    // total payment for gray product
    const totalPay = product?.dyeing_payments?.reduce((sum, payment) => {
      return sum + +payment.amount;
    }, 0);
    // total due
    const totalDue = totalCost && totalPay ? totalCost - totalPay : null;

    // payment data
    const paymentData = product?.dyeing_payments?.map((payment) => {
      return (
        <>
          <TableCell
            data={format(parseISO(payment?.date), "MMM do, yyyy")}
            style={"text-[12px]"}
          />
          <TableCell style={"h-[51px]"}>
            <div className="flex justify-between gap-2 items-center relative group">
              <span>{payment?.amount}</span>
              <div className="hidden group-hover:block">
                <EditPayment payment={payment} />
              </div>
            </div>
          </TableCell>
        </>
      );
    });

    // thaan amount
    const thaan_amount = product?.thaan_count?.reduce((sum, thaan) => {
      return sum + thaan?.amount;
    }, 0);

    // difference from dyeing_amount - gray_amount
    const difference =
      product?.gray_amount && product?.dyeing_amount
        ? product?.gray_amount - product?.dyeing_amount
        : null;
    // rate
    const rate = product?.dyeing_rate;
    // total
    const total =
      product?.dyeing_amount && rate ? product?.dyeing_amount * rate : null;

    const rowSpan = product?.dyeing_payments?.length
      ? product?.dyeing_payments?.length
      : 1;

    const leftSideData = (
      <>
        <TableCell
          data={
            product?.gray_date
              ? format(parseISO(product?.gray_date), "MMM do, yyyy")
              : null
          }
          span={rowSpan}
        />
        <TableCell
          data={
            product?.dyeing_date
              ? format(parseISO(product?.dyeing_date), "MMM do, yyyy")
              : null
          }
          span={rowSpan}
        />
        <TableCell data={product?.chalanNumber} span={rowSpan} />
        <TableCell span={rowSpan}>
          <Link href={`/products/all/${product?.id}`}> {product?.name}</Link>
        </TableCell>
        <TableCell data={product?.dyeing_amount} span={rowSpan} />
        <TableCell data={product?.dyeing_amount} span={rowSpan} />
        <TableCell data={difference} span={rowSpan} />
        <TableCell data={rate} span={rowSpan} />
        <TableCell data={total} span={rowSpan} />
      </>
    );

    const rightSideData = (
      <>
        <TableCell data={totalPay} span={rowSpan} />
        <TableCell data={totalDue} span={rowSpan} />
        <TableCell data={product?.dyeing_payment_status} span={rowSpan} />
        <TableCell data={product?.delivery_status} span={rowSpan} />

        <TableCell span={rowSpan}>
          <Link href={`/dyeings/all/${product?.gray?.id}`}>
            {product?.gray?.name}
          </Link>
        </TableCell>
        <TableCell data="" span={rowSpan}>
          <GivePayment data={product} />
        </TableCell>
      </>
    );

    let productsTd = [];
    if (paymentData.length) {
      productsTd = paymentData.map((dt, index) => {
        if (index === 0) {
          return (
            <>
              {leftSideData}
              {dt}
              {rightSideData}
            </>
          );
        } else {
          return <>{dt}</>;
        }
      });
    } else {
      const empty = (
        <>
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell data="" span={rowSpan}>
            <GivePayment data={product} />
          </TableCell>
        </>
      );

      const data = (
        <>
          {leftSideData}
          {empty}
        </>
      );
      productsTd = [data];
    }
    return [...sum, ...productsTd];
  }, []);

  return (
    <>
      {productTableData?.map((dt, index) => {
        return (
          <tr
            key={index}
            className="border-b border-collapse transition-colors  data-[state=selected]:bg-slate-100  dark:data-[state=selected]:bg-slate-800"
          >
            {dt}
          </tr>
        );
      })}
    </>
  );
}
