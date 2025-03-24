import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import BuyProduct from "../form/BuyProduct";

export default function BuyModal({ refetchGrays, disabled, date }) {
  const [open, setOpen] = useState();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="py-2 h-8 bg-black/5 hover:bg-black/10 rounded-md flex items-center px-3 active:scale-95 transition-all duration-100 text-black    border disabled:active:scale-100 disabled:bg-black/5 disabled:hover:bg-black/5  disabled:text-slate-400"
          // disabled={disabled}
        >
          Buy Fabric
        </DialogTrigger>
        <DialogContent className="overflow-scroll ">
          <DialogHeader>
            <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
              Buy Fabric
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <BuyProduct
            setOpen={setOpen}
            refetchGrays={refetchGrays}
            date={date}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
