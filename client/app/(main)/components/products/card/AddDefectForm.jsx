import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { IoAdd } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import SubmitLoader from "../../SubmitLoader";
import { useUpdateFinishedProductDefectByIdMutation } from "@/features/products/productApi";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddDefectForm({ type, data }) {
  const [updateDefectedProduct, { isLoading }] =
    useUpdateFinishedProductDefectByIdMutation();

  const [open, setOpen] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const defect = e.target.defect.value;

    const response = await updateDefectedProduct({
      id: data.id,
      data: {
        defect,
      },
    });
    if (response?.data?.success) {
      setOpen(false);
      toast.success("Successfully upadted");
    } else if (!response.error?.data?.success) {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="py-2 h-8 rounded-md flex items-center px-3  bg-white active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400 disabled:bg-black/5 disabled:text-slate-400  border"
        title="Add Defected Product"
      >
        <IoAdd className="text-sm" />
      </DialogTrigger>
      <DialogContent className="overflow-scroll ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            {type === "update" ? "Update" : "Add"} Defect Product
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="defect" className={`pt-3 pb-2 block font-semibold`}>
              Defect
            </Label>

            <Input
              id="defect"
              name="defect"
              step="0.01"
              type="number"
              defaultValue={data?.defect}
              className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
            />
          </div>
          <div className="pt-3">
            <Button type="submit">
              {type === "update" ? (
                <SubmitLoader label={"Update"} loading={isLoading} />
              ) : (
                <SubmitLoader label={"Submit"} loading={isLoading} />
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
