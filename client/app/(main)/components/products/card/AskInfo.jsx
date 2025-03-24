import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegEdit } from "react-icons/fa";
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
import { useUpdateProductByIdMutation } from "@/features/products/productApi";
import { toast } from "react-toastify";
import { TbCoinTakaFilled } from "react-icons/tb";

export default function AskInfo({ product }) {
  const [open, setOpen] = useState();

  const [updateProduct, { isLoading }] = useUpdateProductByIdMutation();

  const [fields, setFields] = useState({
    due_ask_rate: product?.due_ask_rate,
    due_sell_rate: product?.due_sell_rate,
    cash_ask_rate: product?.cash_ask_rate,
    cash_sell_rate: product?.cash_sell_rate,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      due_ask_rate: +fields.due_ask_rate,
      due_sell_rate: +fields.due_sell_rate,
      cash_ask_rate: +fields.cash_ask_rate,
      cash_sell_rate: +fields.cash_sell_rate,
    };

    const response = await updateProduct({
      id: +product.id,
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
          <span>Ask</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="py-2 h-8 text-base rounded-md flex items-center px-3 bg-white active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400  border">
              <FaRegEdit />
            </DialogTrigger>
            <DialogContent className="overflow-scroll ">
              <DialogHeader>
                <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                  Update Rate
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="pb-3">
                  <Label className="block font-semibold pb-3">
                    Due Ask Rate
                  </Label>
                  <Input
                    placeholder="Enter due ask rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={fields.due_ask_rate}
                    onChange={(e) =>
                      setFields({ ...fields, due_ask_rate: e.target.value })
                    }
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  />
                </div>
                <div className="pb-3">
                  <Label className="block font-semibold pb-3">
                    Due Sell Rate
                  </Label>
                  <Input
                    placeholder="Enter due sell rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={fields.due_sell_rate}
                    onChange={(e) =>
                      setFields({ ...fields, due_sell_rate: e.target.value })
                    }
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  />
                </div>
                <div className="pb-3">
                  <Label className="block font-semibold pb-3">
                    Cash Ask Rate
                  </Label>
                  <Input
                    name="amount"
                    placeholder="Enter cash ask rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={fields.cash_ask_rate}
                    onChange={(e) =>
                      setFields({ ...fields, cash_ask_rate: e.target.value })
                    }
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  />
                </div>
                <div className="pb-3">
                  <Label className="block font-semibold pb-3">
                    Cash Sell Rate
                  </Label>
                  <Input
                    name="amount"
                    placeholder="Enter cash sell rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={fields.cash_sell_rate}
                    onChange={(e) =>
                      setFields({ ...fields, cash_sell_rate: e.target.value })
                    }
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  />
                </div>

                <div className="pt-3">
                  <Button type="submit">
                    <SubmitLoader label={"Update"} loading={isLoading} />
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Due Ask Rate</span>
            <span className="flex items-center gap-1">
              <TbCoinTakaFilled className="text-lg mt-[2px]" />
              {product?.due_ask_rate || 0}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Due Sell Rate</span>
            <span className="flex items-center gap-1">
              <TbCoinTakaFilled className="text-lg mt-[2px]" />
              {product?.due_sell_rate || 0}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Cash Ask Rate</span>
            <span className="flex items-center gap-1">
              <TbCoinTakaFilled className="text-lg mt-[2px]" />
              {product?.cash_ask_rate || 0}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Cash Sell Rate</span>
            <span className="flex items-center gap-1">
              <TbCoinTakaFilled className="text-lg mt-[2px]" />
              {product?.cash_sell_rate || 0}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
