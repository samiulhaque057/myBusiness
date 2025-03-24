import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MemoProduct from "../MemoProduct";
import { useState } from "react";

export default function BuyProduct({
  setAllSelectedProducts,
  allSelectedProducts,
}) {
  const [open, setOpen] = useState();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 h-8 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5   border">
        Add Product
      </DialogTrigger>
      <DialogContent className="overflow-scroll md:min-w-[50vw] md:min-h-[60vh] ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Add Product
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <MemoProduct
          setAllSelectedProducts={setAllSelectedProducts}
          setOpen={setOpen}
          allSelectedProducts={allSelectedProducts}
        />
      </DialogContent>
    </Dialog>
  );
}
