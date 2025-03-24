import { Card, CardContent } from "@/components/ui/card";
import { numberToFixed } from "../helper";
import Link from "next/link";

export default function BoughtCard({ grays }) {
  const chalans = grays
    ?.reduce((acc, gray) => {
      return [...acc, ...gray?.chalans];
    }, [])
    ?.sort(
      (a, b) =>
        new Date(b?.createAt).getTime() - new Date(a?.createAt).getTime()
    );

  return (
    <>
      {chalans?.map((chalan) => {
        const totalChalanCost = chalan?.products?.reduce((acc, product) => {
          acc += product?.gray_amount * product?.gray_rate;
          return acc;
        }, 0);

        return (
          <Card className="mt-4 bg-slate-100/30" key={chalan?.id}>
            <CardContent className="overflow-hidden">
              <h4 className="text-center text-lg pt-3 font-semibold pb-3 text-nowrap">
                <Link href={`/grays/all/${chalan?.gray?.id}`}>
                  {chalan?.gray?.name}
                </Link>
              </h4>

              {chalan?.products?.map((product) => (
                <div
                  className="py-2 bg-slate-200/40 rounded-md p-2 mt-3 shadow-[4px_4px_2px_1px__#eee] border"
                  key={product.id}
                >
                  <Link
                    href={`/products/all/${product?.id}`}
                    className=" font-semibold py-1"
                  >
                    {product?.name}
                  </Link>
                  <p className="flex justify-between gap-2 items-center py-1">
                    <span title="Amount">
                      {numberToFixed(+product?.gray_amount)}
                    </span>
                    <span>x</span>
                    <span title="Rate">
                      {numberToFixed(+product?.gray_rate)}
                    </span>
                    <span>=</span>
                    <span title="Total">
                      {numberToFixed(product?.gray_amount * product?.gray_rate)}
                    </span>
                  </p>
                </div>
              ))}

              <div className="py-2 mt-4 bg-green-100/50 border rounded-md p-2 flex gap-2 justify-between items-center shadow-sm ">
                <p className=" font-semibold">Total</p>
                <p className="flex justify-between gap-2 items-center py-1 font-medium">
                  {totalChalanCost}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {!chalans?.length ? (
        <div className="py-2">
          <p className="text-red-500 font-medium text-center ">
            No product buy.
          </p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
