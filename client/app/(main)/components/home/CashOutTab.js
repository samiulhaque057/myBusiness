import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDyeingPaymentMutation,
  useGetAllDyeingsQuery,
} from "@/features/dyeing/dyeingApi";
import {
  useGetAllGraysQuery,
  useGrayPaymentMutation,
} from "@/features/gray/grayApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitLoader from "../SubmitLoader";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatISO } from "date-fns";
import { useAddOthersCostMutation } from "@/features/daily/dailyApi";

export default function CashOutTab({ setOpen, date }) {
  const { data: { data: dyeings = [] } = {} } = useGetAllDyeingsQuery();
  const { data: { data: grays = [] } = {} } = useGetAllGraysQuery();

  const [grayPayment, { isLoading: isGrayPaymentLoading }] =
    useGrayPaymentMutation();
  const [dyeingPayment, { isLoading: isDyeingPaymentLoading }] =
    useDyeingPaymentMutation();
  const [othersPayment, { isLoading: isOtherPaymentLoading }] =
    useAddOthersCostMutation();

  const [dyeingInputs, setDyeingInputs] = useState({
    id: "",
    amount: 0,
  });
  const [grayInputs, setGrayInputs] = useState({
    id: "",
    amount: 0,
  });
  const [othersInputs, setOthersInputs] = useState({
    name: "",
    amount: 0,
  });

  const handleGraySubmit = async (e) => {
    e.preventDefault();
    const { id, amount } = grayInputs;

    if (!id) return toast.error("Gray is required");
    if (!amount) return toast.error("Amount is required");

    const response = await grayPayment({
      grayId: +grayInputs.id,
      amount: grayInputs.amount,
      // date: formatISO(new Date()),
      date: formatISO(date).split("T")[0],
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      setOpen(false);
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };
  const handleDyeingSubmit = async (e) => {
    e.preventDefault();
    const { id, amount } = dyeingInputs;

    if (!id) return toast.error("Dyeing is required");
    if (!amount) return toast.error("Amount is required");
    const response = await dyeingPayment({
      dyeingId: +dyeingInputs.id,
      amount: dyeingInputs.amount,
      date: formatISO(date).split("T")[0],
      // date: formatISO(new Date()),
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      setOpen(false);
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };
  const hanldeOthersSubmit = async (e) => {
    e.preventDefault();
    const { name, amount } = othersInputs;

    if (!name) return toast.error("Name is required");
    if (!amount) return toast.error("Amount is required");
    const response = await othersPayment({
      amount: othersInputs.amount,
      date: formatISO(date).split("T")[0],
      // date: formatISO(new Date()),
      name: othersInputs.name,
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      setOpen(false);
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="others" className="min-w-[400px] w-full">
        <TabsList className="w-full">
          <TabsTrigger value="gray" className="w-full">
            Gray Payment
          </TabsTrigger>
          <TabsTrigger value="dyeing" className="w-full">
            Dyeing Payment
          </TabsTrigger>
          <TabsTrigger value="others" className="w-full">
            Others Cost
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gray" className="w-full">
          <div className="px-4 py-2">
            <form onSubmit={handleGraySubmit}>
              <div className="py-3">
                <Label className="py-3 block">Select Gray</Label>
                <Select
                  className="block"
                  onValueChange={(value) => {
                    const [name, id] = value.split("___");
                    setGrayInputs((prev) => {
                      return { ...prev, id };
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gray" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {grays?.map((gray) => {
                      return (
                        <SelectItem
                          key={gray.id}
                          value={gray.name + "___" + gray.id}
                        >
                          {gray.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="py-0">
                <Label className="py-3 block">Amount</Label>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  step="0.01"
                  type="number"
                  min={0}
                  value={grayInputs.amount}
                  onChange={(e) => {
                    setGrayInputs((prev) => {
                      return { ...prev, amount: +e.target.value };
                    });
                  }}
                  placeholder="Enter gray amount"
                />
              </div>
              <div className="py-3">
                <Button type="submit">
                  <SubmitLoader
                    label={"Submit"}
                    loading={isGrayPaymentLoading}
                  />
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="dyeing">
          <div className="px-4 py-2">
            <form onSubmit={handleDyeingSubmit}>
              <div className="py-3">
                <Label className="py-3 block">Select Dyeing</Label>
                <Select
                  className="block"
                  onValueChange={(value) => {
                    const [name, id] = value.split("___");
                    setDyeingInputs((prev) => {
                      return { ...prev, id };
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Dyeing" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {dyeings?.map((dyeing) => {
                      return (
                        <SelectItem
                          key={dyeing.id}
                          value={dyeing.name + "___" + dyeing.id}
                        >
                          {dyeing.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <Label className="py-3 block">Amount</Label>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  step="0.01"
                  type="number"
                  value={dyeingInputs.amount}
                  onChange={(e) => {
                    setDyeingInputs((prev) => {
                      return { ...prev, amount: +e.target.value };
                    });
                  }}
                  min={0}
                  placeholder="Enter dyeing amount"
                />
              </div>
              <div className="py-3">
                <Button type="submit">
                  <SubmitLoader
                    label={"Submit"}
                    loading={isDyeingPaymentLoading}
                  />
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="others">
          <div className="px-4 py-2">
            <form onSubmit={hanldeOthersSubmit}>
              <div className="py-3">
                <Label className="py-3 block">Others Cost</Label>
                <Input
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  type="text"
                  value={othersInputs.name}
                  onChange={(e) => {
                    setOthersInputs((prev) => {
                      return { ...prev, name: e.target.value };
                    });
                  }}
                  placeholder="Enter others cost name"
                />
              </div>

              <div className="py-0">
                <Label className="py-3 block">Amount</Label>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  step="0.01"
                  type="number"
                  value={othersInputs.amount}
                  onChange={(e) => {
                    setOthersInputs((prev) => {
                      return { ...prev, amount: +e.target.value };
                    });
                  }}
                  placeholder="Enter others amount"
                  min={0}
                />
              </div>
              <div className="py-3">
                <Button type="submit">
                  <SubmitLoader
                    label={"Submit"}
                    loading={isOtherPaymentLoading}
                  />
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
