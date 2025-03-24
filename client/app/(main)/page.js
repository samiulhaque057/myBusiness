"use client";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  useGetAllcustomersPaymentsQuery,
  useGetAllCustomersQuery,
} from "@/features/customers/customerApi";
import { useGetDailyByDateQuery } from "@/features/daily/dailyApi";
import { useGetAllDyeingsPaymentsQuery } from "@/features/dyeing/dyeingApi";
import {
  useGetAllGraysPaymentsQuery,
  useGetAllGraysQuery,
} from "@/features/gray/grayApi";
import { arabicDate, banglaDate, dayName, englishDate } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { siliguri } from "../layout";
import BalanceCashIn from "@/app/(main)/components/home/BalanceCashIn";
import BoughtCard from "./components/home/BoughtCard";
import BuyModal from "./components/home/BuyModal";
import CardLoader from "./components/home/CardLoader";
import CardTitle from "./components/home/CardTitle";
import CashInCard from "./components/home/CashInCard";
import CashOutCard from "./components/home/CashOutCard";
import CashOutTab from "./components/home/CashOutTab";
import SoldCard from "./components/home/SoldCard";

const today = new Date();

export default function Home() {
  const [date, setDate] = useState(today);

  //grays data
  const {
    data: { data: grays = [] } = {},
    isLoading: isGrayLoading,
    refetch: refetchGrays,
    isFetching: isGrayFetching,
  } = useGetAllGraysQuery(
    `?date[eq]=${date ? format(date, "yyyy-MM-dd") : ""}`
  );

  //customers data
  const {
    data: { data: customers = [] } = {},
    isLoading: isCustomerLoading,
    isFetching: isCustomersFetching,
  } = useGetAllCustomersQuery(
    `?date[eq]=${date ? format(date, "yyyy-MM-dd") : ""}`
  );

  /// customer payments
  const {
    data: { data: customersPayments = [] } = {},
    isLoading: isCustomerPaymentsLoading,
    isFetching: isCustomerPaymentsFetching,
  } = useGetAllcustomersPaymentsQuery(
    `?date[eq]=${date ? format(date, "yyyy-MM-dd") : ""}`
  );
  // gray payments
  const {
    data: { data: graysPayments = [] } = {},
    isLoading: isGrayPaymentsLoading,
    isFetching: isGrayPaymentsFetching,
  } = useGetAllGraysPaymentsQuery(
    `?date[eq]=${date ? format(date, "yyyy-MM-dd") : ""}`
  );
  // dyeing payments
  const { data: { data: dyeingsPayments = [] } = {} } =
    useGetAllDyeingsPaymentsQuery(
      `?date[eq]=${date ? format(date, "yyyy-MM-dd") : ""}`
    );

  // daily cash

  const { data: { data: dailyCash = {} } = {} } = useGetDailyByDateQuery(
    `${date ? format(date, "yyyy-MM-dd") : ""}`
  );

  const [open, setOpen] = useState();

  return (
    <main className="p-4 ">
      <ElahiVorsa />

      {/* start date  */}
      <div className="flex justify-between items-center gap-6  pt-3  px-4">
        <p className={`${siliguri.variable} font-bangla`}>{banglaDate(date)}</p>
        <p className={`${siliguri.variable} font-bangla`}>
          {arabicDate(date)} ({dayName(date)})
        </p>
        <p>{englishDate(date)}</p>
      </div>
      {/* end date  */}

      {/* date picker */}
      <div className="pt-5 px-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mb-10 py-4 px-4  gap-2 flex">
        <BuyModal
          refetchGrays={refetchGrays}
          disabled={format(date, "yyyy-MM-dd") !== format(today, "yyyy-MM-dd")}
          date={date}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className="py-2 h-8 bg-black/5 hover:bg-black/10 rounded-md flex items-center px-3 active:scale-95 transition-all duration-100 text-black    border disabled:active:scale-100 disabled:bg-black/5 disabled:hover:bg-black/5  disabled:text-slate-400  "
            // disabled={
            //   format(date, "yyyy-MM-dd") !== format(today, "yyyy-MM-dd")
            // }
          >
            Cash Out
          </DialogTrigger>
          <DialogContent className="overflow-scroll ">
            <DialogHeader>
              <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                Cash Out
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CashOutTab setOpen={setOpen} date={date} />
          </DialogContent>
        </Dialog>
        <BalanceCashIn
          disabled={format(date, "yyyy-MM-dd") !== format(today, "yyyy-MM-dd")}
          date={date}
        />
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg mb-12"
      >
        <ResizablePanel defaultSize={25} className="p-3 ">
          <div className="w-full ">
            <CardTitle title={"Bought Fabric"} />

            {isGrayLoading || isGrayFetching ? (
              <CardLoader />
            ) : (
              <BoughtCard grays={grays} />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} className="p-3">
          <div className="w-full">
            <CardTitle title={"Sold Fabric"} />
            {isCustomerLoading || isCustomersFetching ? (
              <CardLoader />
            ) : (
              <SoldCard customers={customers} />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} className="p-3">
          <div className="w-full">
            <CardTitle title={"Cash In"} />

            {isCustomerPaymentsLoading || isCustomerPaymentsFetching ? (
              <CardLoader />
            ) : (
              <CashInCard
                customersPayments={customersPayments}
                dailyCash={dailyCash}
                date={date ? format(date, "yyyy-MM-dd") : ""}
                graysPayments={graysPayments}
                dyeingsPayments={dyeingsPayments}
              />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} className="p-3">
          <div className="w-full">
            <CardTitle title={"Cash Out"} />

            {isGrayPaymentsLoading || isGrayPaymentsFetching ? (
              <CardLoader />
            ) : (
              <CashOutCard
                graysPayments={graysPayments}
                dyeingsPayments={dyeingsPayments}
                dailyCash={dailyCash}
              />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
