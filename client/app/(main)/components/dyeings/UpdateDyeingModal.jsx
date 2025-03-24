import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditDyeingCard from "./EditDyeingCard";
import { useState } from "react";

export default function UpdateDyeingModal({ data }) {
  const [open, setOpen] = useState();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-black/10 disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:text-slate-500 disabled:hover:text-slate-500 rounded-md text-black text-[12px] border hover:bg-black/15 hover:text-black h-8 px-2">
        Edit
      </DialogTrigger>
      <DialogContent className="overflow-scroll ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Edit Dyeing
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <EditDyeingCard
          type="edit"
          setOpen={setOpen}
          data={data}
          products={data?.products}
          // from="dyeing"
          // due={totalDue}
        />
      </DialogContent>
    </Dialog>
  );
}
