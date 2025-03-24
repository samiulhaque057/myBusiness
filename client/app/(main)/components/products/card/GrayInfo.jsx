import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitLoader from "@/app/(main)/components/SubmitLoader";
import { toast } from "react-toastify";
import { useUpdateProductByIdMutation } from "@/features/products/productApi";
import { numberToFixed } from "../../helper";
import { TbCoinTakaFilled, TbCurrencyTaka } from "react-icons/tb";

export default function GrayInfo({ name, amount, rate, date, id, productId }) {
  const [open, setOpen] = useState();

  const [updateProduct, { isLoading }] = useUpdateProductByIdMutation();

  const [fields, setFields] = useState({
    amount: amount,
    rate: rate,
  });

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      gray_amount: +fields.amount,
      gray_rate: +fields.rate,
    };

    const response = await updateProduct({
      id: +productId,
      data,
    });

    if (response?.data?.success) {
      toast.success("Successfully updated.");
      setOpen(false);
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-100 rounded-t-md py-3">
        <CardTitle className="text-center flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link href={`/grays/all/${id}`}>Gray Company</Link>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="py-2 h-8 text-base rounded-md flex items-center px-3 bg-white active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400  border">
                <FaRegEdit />
              </DialogTrigger>
              <DialogContent className="overflow-scroll ">
                <DialogHeader>
                  <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                    Update Product Data
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <form>
                  <div className="pb-3">
                    <Label className="block font-semibold pb-3">
                      Gray Amount
                    </Label>
                    <Input
                      name="amount"
                      placeholder="Enter gray amount"
                      type="text"
                      value={fields.amount}
                      onChange={(e) =>
                        setFields({ ...fields, amount: e.target.value })
                      }
                      className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    />
                  </div>
                  <div className="py-3">
                    <Label className="block pb-3 font-semibold">
                      Gray Rate
                    </Label>
                    <Input
                      name="rate"
                      placeholder="Enter gray rate"
                      type="number"
                      value={fields.rate}
                      onChange={(e) =>
                        setFields({ ...fields, rate: e.target.value })
                      }
                      className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    />
                  </div>
                  <div className="pt-3">
                    <Button type="button" onClick={handleSubmit}>
                      <SubmitLoader label={"Update"} loading={isLoading} />
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <span className=" flex gap-1 items-center flex-col">
            <LuCalendarDays /> <span className="text-sm">{date}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Name</span>
            <span>{name}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Amount</span>
            <span>{amount}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium"> Rate</span>
            <span>{rate}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium"> Total</span>
            <span className="flex items-center gap-1">
              <TbCoinTakaFilled className="text-lg mt-[2px]" />
              {numberToFixed((amount || 0) * (rate || 0))}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
