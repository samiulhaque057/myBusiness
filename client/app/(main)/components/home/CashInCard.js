import { Card, CardContent } from "@/components/ui/card";
import { numberToFixed } from "../helper";
import Link from "next/link";

export default function CashInCard({
  customersPayments,
  dailyCash,
  graysPayments,
  dyeingsPayments,
  date,
}) {
  const todaySold = customersPayments?.reduce((acc, payment) => {
    return acc + payment?.amount;
  }, 0);

  const [onlyTodaySold, previosSoldPayment] = customersPayments?.reduce(
    (acc, payment) => {
      if (payment?.CustomerChalan?.date === date) {
        acc[0] = acc[0] + payment?.amount;
        return acc;
      } else {
        acc[1] = acc[1] + payment?.amount;
      }
      return acc;
    },
    [0, 0]
  );

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
  const todayBalanceAdd =
    dailyCash?.cashIn?.reduce((sum, cash) => {
      return sum + cash?.amount;
    }, 0) || 0;

  const todayCash =
    todaySold + (dailyCash?.previous || 0) + todayBalanceAdd - totalCost;

  return (
    <>
      <Card className="mt-4 bg-slate-100/50">
        <CardContent className="pt-4 overflow-hidden">
          {customersPayments?.map((payment) => (
            <div
              className="py-2   bg-white text-slate-600  overflow-hidden  rounded-md p-2 mt-2   "
              key={payment?.id}
            >
              <p className="flex justify-between items-center gap-4 ">
                <Link
                  href={`/customers/all/${payment?.customer?.id}`}
                  className="font-medium"
                >
                  {payment?.customer?.name}
                </Link>
                <span> {payment?.amount}</span>
              </p>
            </div>
          ))}

          <div className="py-2 mt-4 bg-green-100/70 rounded-md p-2 flex gap-2 justify-between items-center">
            <p className=" font-semibold py-1">Sold</p>
            <p className="flex justify-between gap-2 items-center py-1">
              {numberToFixed(onlyTodaySold)}
            </p>
          </div>
          <div className="p-2 py-2">
            <p className="flex justify-between items-center gap-4 ">
              <span className="font-semibold">Previous</span>
              <span>{numberToFixed(dailyCash?.previous) || 0}</span>
            </p>
          </div>
          <div className="p-2 py-2">
            <p className="flex justify-between items-center gap-4 ">
              <span className="font-semibold">Balance Add</span>
              <span>
                {numberToFixed(todayBalanceAdd + previosSoldPayment) || 0}
              </span>
            </p>
          </div>
          <div>
            <hr />
          </div>
          <div className="p-2 py-2">
            <p className="flex justify-between items-center gap-4 ">
              <span className="font-semibold">Today&apos;s Cash</span>
              <span>
                {todaySold +
                  numberToFixed((dailyCash?.previous || 0) + todayBalanceAdd)}
              </span>
            </p>
          </div>
          <div className="p-2 py-2">
            <p className="flex justify-between items-center gap-4 ">
              <span className="font-semibold">Cash Out</span>
              <span>{numberToFixed(totalCost)}</span>
            </p>
          </div>
          <div>
            <hr />
          </div>
          <div className="p-2 py-2">
            <p
              className={`${
                todayCash < 0 ? "text-red-500" : ""
              } flex justify-between items-center gap-4 `}
            >
              <span className="font-semibold">Total Cash </span>
              <span>{numberToFixed(todayCash)}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
