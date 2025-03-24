import { TbCreditCardPay } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import GrayPaymentForm from "../../app/(main)/grays/all/[id]/GrayPaymentForm";

import { format, parseISO } from "date-fns";

import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "../ui/button";
import { IoTrashOutline } from "react-icons/io5";
import { useDeleteGrayPaymentByIdMutation } from "@/features/gray/grayApi";
import Swal from "sweetalert2";
import { useState } from "react";
import ThaanEditForm from "../form/ThaanEditForm";
import { useDeleteThaanByIdMutation } from "@/features/products/productApi";

export const TableCell = ({ data, span = 1, style, children }) => {
  return (
    <td
      rowSpan={span}
      className={`${style} px-5 text-nowrap py-3 align-middle [&:has([role=checkbox])]:pr-0 border border-collapse`}
    >
      <div className="">{data}</div>

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
              Payment to Grayer
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* <GrayPaymentForm data={data} setOpen={setOpen} /> */}
          {/* <GrayForm /> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EditPayment = ({ payment }) => {
  const [deletePayment] = useDeleteGrayPaymentByIdMutation();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Gray payment will be delete.",
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
              Payment to Grayer
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* <GrayPaymentForm type="update" payment={payment} setOpen={setOpen} /> */}
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

export const ThaanEdit = ({ thaan }) => {
  const [open, setOpen] = useState(false);
  const [deleteThaan] = useDeleteThaanByIdMutation();

  // handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Thaan data will be delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result?.isConfirmed) {
      const res = await deleteThaan(id);
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
              Update Thaan Data
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ThaanEditForm thaan={thaan} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
      <Button
        className=" text-lg   py-1.5 px-1.5 h-fit bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-red-400  border"
        onClick={() => handleDelete(thaan?.id)}
        disabled={true}
      >
        <IoTrashOutline className="text-[12px]" />
      </Button>
    </div>
  );
};

export default function TableProduct({ productData: product }) {
  // product table data
  const productTableData = () => {
    // thaan  data
    const thaanData = product?.thaan_count?.map((thaan) => {
      return (
        <>
          {/* Thaan Count */}
          <TableCell style={"h-[51px]"}>
            <div className="flex justify-between gap-5 items-center relative group">
              <span>{thaan?.amount}</span>
              <div className="hidden group-hover:block">
                <ThaanEdit thaan={thaan} />
              </div>
            </div>
          </TableCell>
          {/* Defect Count */}
          <TableCell data={thaan?.defect} />
        </>
      );
    });

    const rowSpan = product?.thaan_count?.length
      ? product?.thaan_count?.length
      : 1;

    const thaan_amount = product?.thaan_count.reduce((sum, thaan) => {
      return sum + thaan?.amount;
    }, 0);
    const total_defect = product?.thaan_count.reduce((sum, thaan) => {
      return sum + thaan?.defect;
    }, 0);
    const difference_from_gray =
      thaan_amount && product?.gray_amount
        ? thaan_amount - product?.gray_amount
        : null;

    const leftSideData = (
      <>
        {/* gray memo date  */}
        <TableCell
          data={
            product?.gray_date
              ? format(parseISO(product?.gray_date), "MMM do, yyyy")
              : null
          }
          span={rowSpan}
        />
        {/* dyeing memo date  */}
        <TableCell
          data={
            product?.dyeing_date
              ? format(parseISO(product?.dyeing_date), "MMM do, yyyy")
              : null
          }
          span={rowSpan}
        />
        {/* gray company  */}
        <TableCell data={product?.gray?.name} span={rowSpan} />
        {/* dyeing company  */}
        <TableCell data={product?.dyeing?.name} span={rowSpan} />
        {/* chalan  */}
        <TableCell data={product?.chalanNumber} span={rowSpan} />
        {/* product  */}
        <TableCell data={product?.name} span={rowSpan} />
        {/* gray lot  */}
        <TableCell data={product?.gray_amount} span={rowSpan} />
        {/* Received From Gray  */}
        <TableCell data={product?.dyeing_amount} span={rowSpan} />
        {/* Difference From Gray  // thaan_amount-gray_amount */}
        <TableCell data={difference_from_gray} span={rowSpan} />
      </>
    );

    const rightSideData = (
      <>
        {/* Thaan Amount */}
        <TableCell data={thaan_amount} span={rowSpan} />
        {/* Difference From Gray Lot // thaan_amount -gray_lot */}
        <TableCell data={thaan_amount - product?.gray_amount} span={rowSpan} />
        {/* Difference From Dyeing Lot // thaan_amount -receive_from_dyeing */}
        <TableCell
          data={thaan_amount - product?.dyeing_amount}
          span={rowSpan}
        />
        {/* Total Defect */}
        <TableCell data={total_defect} span={rowSpan} />
      </>
    );

    let productsTd = [];
    if (thaanData.length) {
      productsTd = thaanData.map((dt, index) => {
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
      const data = <>{leftSideData}</>;
      productsTd = [data];
    }
    return [...productsTd];
  };

  return (
    <>
      {/* <div>ok</div> */}
      {productTableData()?.map((dt, index) => {
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
