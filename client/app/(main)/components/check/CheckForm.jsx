"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  useAddGrayMutation,
  useUpdateGrayByIdMutation,
} from "@/features/gray/grayApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  useAddCustomerCheckMutation,
  useGetAllCustomersQuery,
  useUpdateCustomerCheckByIdMutation,
} from "@/features/customers/customerApi";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import SubmitLoader from "../SubmitLoader";
import { cn } from "@/lib/utils";

export default function CheckForm({ type = "add", formData = {}, setOpen }) {
  const [addCheck, { isLoading }] = useAddCustomerCheckMutation();
  const [updateCheck, { isLoading: isUpdateLoading }] =
    useUpdateCustomerCheckByIdMutation();

  const { data: { data: customers = [] } = {} } = useGetAllCustomersQuery();

  const [fields, setFields] = useState({
    name: formData?.customer?.name ? formData?.customer?.name : "",
    amount: formData?.amount ? formData?.amount : 0,
    bank: formData?.bank ? formData?.bank : "",
    date: formData?.date ? formData?.date : "",
    customerId: formData?.customer?.id ? formData?.customer.id : "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // delete name
    const { bank, amount, name, date } = fields;

    if (!name) return toast.error("Select customer.");
    if (!bank) return toast.error("Bank name is required!.");
    if (!amount) return toast.error("Amount is required!.");
    if (!date) return toast.error("Date is required!");

    delete fields.name;

    // for update form
    if (type === "update") {
      const res = await updateCheck({
        id: formData.id,
        data: fields,
      });
      if (res.data?.success) {
        setOpen && setOpen(false);
        toast.success(res.data?.message);
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
    // for edit form
    else if (type === "add") {
      const res = await addCheck(fields);
      if (res.data?.success) {
        toast.success(res.data?.message);
        setOpen && setOpen(false);
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
  };

  return (
    <>
      <form className="space-y-4 w-full">
        <div className="pb-3">
          <Label className="block font-semibold pb-3">Customer Name</Label>
          <Select
            onValueChange={(value) => {
              const [name, customerId] = value.split("___");

              if (name) {
                setFields((prev) => ({
                  ...prev,
                  customerId: +customerId,
                  name,
                }));
              }
            }}
            defaultValue={
              fields?.name ? fields?.name + "___" + fields?.customerId : ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select customer name" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map((customer) => (
                <SelectItem
                  value={customer.name + "___" + customer.id}
                  key={customer.id}
                >
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="pb-3">
          <Label className="block font-semibold pb-3">Bank Name</Label>
          <Input
            name="bank"
            placeholder="Enter bank name"
            type="text"
            value={fields.bank}
            onChange={(e) => setFields({ ...fields, bank: e.target.value })}
            className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
          />
        </div>
        <div className="pb-3">
          <Label className="block font-semibold pb-3">Amount</Label>
          <Input
            name="amount"
            placeholder="Enter amount"
            type="number"
            step="0.01"
            value={fields.amount}
            onChange={(e) => setFields({ ...fields, amount: e.target.value })}
            className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
          />
        </div>
        <div className="py-3">
          <Label className="block font-semibold pb-3">Dyeing Date</Label>
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

        {type === "update" ? (
          <Button type="submit" onClick={handleSubmit}>
            <SubmitLoader loading={isUpdateLoading} label={"Update"} />
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit}>
            <SubmitLoader loading={isLoading} label={"Submit"} />
          </Button>
        )}
      </form>
    </>
  );
}
