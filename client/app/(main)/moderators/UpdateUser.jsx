import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserAddForm from "./UserAddForm";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
export default function UpdateUser({ formData }) {
  const [openModel, setOpenModel] = useState(false);
  return (
    <Dialog open={openModel} onOpenChange={setOpenModel}>
      <DialogTrigger className="py-2 h-8 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400  border">
        <FaRegEdit />
      </DialogTrigger>
      <DialogContent className="overflow-scroll ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Update User Data
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <UserAddForm setOpen={setOpenModel} formData={formData} type="update" />
      </DialogContent>
    </Dialog>
  );
}
