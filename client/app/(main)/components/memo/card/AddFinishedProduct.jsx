import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ThaanAddForm from "../../products/card/ThaanAddForm";
import { useEffect, useState } from "react";
import AddFinishedProductForm from "../../products/card/finisshedProduct/AddFinishedProductForm";

export default function AddFinishedProductFromMemo({ product, refetch }) {
  const [open, setOpen] = useState();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 h-8 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5   border">
        Add Finished Product
      </DialogTrigger>
      <DialogContent className="overflow-scroll  ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Add Finished Product
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <AddFinishedProductForm
          type={"add"}
          setOpen={setOpen}
          refetch={refetch}
          product={{
            id: product?.id,
            finished_products: [],
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
