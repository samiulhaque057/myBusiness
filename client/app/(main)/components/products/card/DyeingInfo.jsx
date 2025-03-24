import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LuCalendarDays } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { useUpdateProductByIdMutation } from "@/features/products/productApi";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitLoader from "@/app/(main)/components/SubmitLoader";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllDyeingsQuery } from "@/features/dyeing/dyeingApi";
import { numberToFixed } from "../../helper";
import { TbCoinTakaFilled } from "react-icons/tb";

export default function DyeingInfo({
  name,
  date,
  amount,
  rate,
  id,
  productId,
}) {
  const [open, setOpen] = useState();
  const [fields, setFields] = useState({
    amount: amount,
    rate: rate,
    date: date ? date : "",
    id: id,
  });

  const [updateProduct, { isLoading }] = useUpdateProductByIdMutation();
  const { data: { data: dyeings = [] } = {} } = useGetAllDyeingsQuery();

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      dyeing_amount: +fields.amount || null,
      dyeing_rate: +fields.rate || null,
      dyeing_date: fields?.date ? format(fields.date, "yyyy-MM-dd") : null,
      dyeingId: +fields.id || null,
    };

    // remove empty fields from data
    Object.keys(data).forEach((key) => data[key] === null && delete data[key]);

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
            <Link href={`/dyeings/all/${id}`}>Dyeing Company</Link>
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
                      Dyeing Amount
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        const [name, id] = value.split("___");
                        setFields({ ...fields, id });
                      }}
                      defaultValue={name ? name + "___" + id : ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select dyeing name" />
                      </SelectTrigger>
                      <SelectContent>
                        {dyeings?.map((dyeing) => (
                          <SelectItem
                            value={dyeing.name + "___" + dyeing.id}
                            key={dyeing.id}
                          >
                            {dyeing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pb-3">
                    <Label className="block font-semibold pb-3">
                      Dyeing Amount
                    </Label>
                    <Input
                      name="amount"
                      placeholder="Enter dyeing amount"
                      type="number"
                      step="0.01"
                      value={fields.amount}
                      onChange={(e) =>
                        setFields({ ...fields, amount: e.target.value })
                      }
                      className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    />
                  </div>
                  <div className="py-3">
                    <Label className="block pb-3 font-semibold">
                      Dyeing Rate
                    </Label>
                    <Input
                      name="rate"
                      placeholder="Enter dyeing rate"
                      type="number"
                      step="0.01"
                      value={fields.rate}
                      onChange={(e) =>
                        setFields({ ...fields, rate: e.target.value })
                      }
                      className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    />
                  </div>
                  <div className="py-3">
                    <Label className="block font-semibold pb-3">
                      Dyeing Date
                    </Label>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fields.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fields.date ? (
                            format(fields.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fields.date}
                          onSelect={(date) => {
                            setFields({ ...fields, date: date });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
            <span className="font-medium">Received From Dyeing</span>
            <span>{amount}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium"> Rate</span>
            <span>{rate}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium"> Total </span>
            <span className="flex items-center gap-1">
              <TbCoinTakaFilled className="text-lg mt-[2px]" />
              {numberToFixed((amount || 0) * (rate || 0))}{" "}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
