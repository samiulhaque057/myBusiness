import PaymentForm from "@/app/(main)/components/form/PaymentForm";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useDeleteDyeingPaymentByIdMutation,
  useUpdateDyeingPaymentByIdMutation,
} from "@/features/dyeing/dyeingApi";

import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";

export const EditDyeingPayment = ({ due, payment }) => {
  const [open, setOpen] = useState(false);

  const [deletePayment] = useDeleteDyeingPaymentByIdMutation();
  const [updatePayemnt, { isLoading }] = useUpdateDyeingPaymentByIdMutation();

  // handle delete payment
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete dyeing payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result?.isConfirmed) {
      const res = await deletePayment(id);
      if (res?.data?.success) {
        Swal.fire("Deleted!", "Dyeing payment  has been deleted.", "success");
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
              Update Payment Data
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <PaymentForm
            type="update"
            beforePaymentData={payment}
            setOpen={setOpen}
            updatePayemnt={updatePayemnt}
            isLoading={isLoading}
            dueAmount={due}
          />
        </DialogContent>
      </Dialog>
      <Button
        className=" text-lg   py-1.5 px-1.5 h-fit bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-red-400  border"
        onClick={() => handleDelete(payment?.id)}
        disabled={true}
      >
        <IoTrashOutline className="text-[12px]" />
      </Button>
    </div>
  );
};
