import { Card, CardContent } from "@/components/ui/card";
import { numberToFixed } from "../helper";

export default function CashOutCard({
  graysPayments,
  dyeingsPayments,
  dailyCash,
}) {
  const totalGraysPayment =
    graysPayments?.reduce((sum, payment) => {
      return sum + (payment?.amount || 0);
    }, 0) || 0;
  const totalDyeingsPayment =
    dyeingsPayments?.reduce((sum, payment) => {
      return sum + (payment?.amount || 0);
    }, 0) || 0;

  const othersCost =
    dailyCash.othersCost?.reduce((sum, cost) => {
      return sum + (cost?.amount || 0);
    }, 0) || 0;

  const totalCost = totalDyeingsPayment + totalGraysPayment + othersCost;

  return (
    <>
      <Card className="mt-4 bg-slate-100/60">
        <CardContent className="overflow-hidden">
          {graysPayments?.map((payment) => (
            <div
              className="py-2 bg-slate-200/40 rounded-md p-2 mt-2"
              key={payment?.id}
            >
              <p className="flex justify-between items-center gap-4 ">
                <span>{payment?.gray?.name} </span>
                <span> {numberToFixed(payment?.amount)}</span>
              </p>
            </div>
          ))}
          {dyeingsPayments?.map((payment) => (
            <div
              className="py-2 bg-slate-200/40 rounded-md p-2 mt-2"
              key={payment?.id}
            >
              <p className="flex justify-between items-center gap-4 ">
                <span>{payment?.dyeing?.name} </span>
                <span> {numberToFixed(payment?.amount)}</span>
              </p>
            </div>
          ))}

          {dailyCash?.othersCost?.map((cost) => (
            <div
              className="py-2 bg-slate-200/40 rounded-md p-2 mt-2"
              key={cost.id}
            >
              <p className="flex justify-between items-center gap-4 ">
                <span>{cost?.name} </span>
                <span> {numberToFixed(cost?.amount)}</span>
              </p>
            </div>
          ))}
          <div className="py-2 mt-4 bg-red-50/80 rounded-md p-2 flex gap-2 justify-between items-center">
            <p className=" font-semibold py-1">Total Cash Out</p>
            <p className="flex justify-between gap-2 items-center py-1">
              {numberToFixed(totalCost)}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
