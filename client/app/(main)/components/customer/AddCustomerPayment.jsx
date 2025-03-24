import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GrAddCircle } from "react-icons/gr";
import PaymentForm from "@/app/(main)/components/form/PaymentForm";
import { useCustomerChalanPaymentMutation } from "@/features/customers/customerApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreviousPayment from "./PreviousPayment";

export default function AddCustomerPayment({ data }) {
  const [addPayment, { isLoading }] = useCustomerChalanPaymentMutation();

  const [open, setOpen] = useState();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 h-10 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-slate-600  border">
        <GrAddCircle /> <span className="text-[12px] pl-2">Payment</span>
      </DialogTrigger>
      <DialogContent className="overflow-scroll ">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Add Payment
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="current" className="w-full ">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="previous">Previous</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <PaymentForm
              addPayment={addPayment}
              data={data}
              isLoading={isLoading}
              type="add"
              setOpen={setOpen}
            />
          </TabsContent>
          <TabsContent value="previous">
            <PreviousPayment
              addPayment={addPayment}
              data={{
                ...data,
                isPreviousPayment: true,
              }}
              isLoading={isLoading}
              type="add"
              setOpen={setOpen}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
