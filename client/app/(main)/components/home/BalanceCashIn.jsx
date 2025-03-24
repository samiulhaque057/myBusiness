import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import SubmitLoader from "../SubmitLoader";
import { toast } from "react-toastify";
import { useAddBalanceMutation } from "@/features/daily/dailyApi";
import { MdAddCircle } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RiAddCircleLine } from "react-icons/ri";
import { formatISO } from "date-fns";

export default function BalanceCashIn({ disabled, date }) {
  const [open, setOpen] = useState();

  const [amount, setAmount] = useState(0);

  const [addBalance, { isLoading }] = useAddBalanceMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return toast.error("Amount is required!.");

    const response = await addBalance({
      amount,
      date: formatISO(date).split("T")[0],
    });
    if (response?.data?.success) {
      toast.success("Balance added.");
      e?.target?.reset();
      setAmount(0);
      setOpen(false);
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="py-2 h-8 bg-black/5 hover:bg-black/10 rounded-md flex items-center px-3 active:scale-95 transition-all duration-100 text-black    border  gap-1 disabled:active:scale-100 disabled:bg-black/5 disabled:hover:bg-black/5  disabled:text-slate-400"
        // disabled={disabled}
      >
        <RiAddCircleLine />
        Balance
      </DialogTrigger>
      <DialogContent className="overflow-scroll ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Balance Cash In
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* <CashOutTab setOpen={setOpen} /> */}
        <form onSubmit={handleSubmit}>
          <div className="py-0">
            <Label className="py-3 block">Amount</Label>
            <Input
              className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
              step="0.01"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Enter balance amount"
            />
          </div>
          <div className="py-3">
            <Button type="submit">
              <SubmitLoader label={"Submit"} loading={isLoading} />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
