import PaymentForm from "@/app/(main)/components/form/PaymentForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

export default function UpdatePaymentModal({
  row,
  updatePayemnt,
  isUpdateLoading,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 h-8 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400  border">
        <FaRegEdit />
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
          beforePaymentData={{
            id: +row.original.id,
            amount: row?.original?.amount,
            date: row?.original?.date,
          }}
          setOpen={setOpen}
          updatePayemnt={updatePayemnt}
          isLoading={isUpdateLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
