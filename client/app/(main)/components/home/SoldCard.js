import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SoldCard({ customers }) {
  const chalans = customers
    ?.reduce((acc, customer) => {
      return [...acc, ...customer?.chalans];
    }, [])
    ?.sort(
      (a, b) =>
        new Date(b?.createAt).getTime() - new Date(a?.createAt).getTime()
    );

  return (
    <>
      {chalans?.map((chalan) => {
        const totalChalanProductCost = chalan?.customerProducts?.reduce(
          (sum, product) => {
            const totalAmount = product?.finishedProducts?.reduce(
              (acc, item) => acc + item?.amount,
              0
            );
            return sum + product?.product_rate * totalAmount;
          },
          0
        );

        return (
          <Card className="mt-4 bg-slate-100/30" key={chalan?.id}>
            <CardContent className="overflow-hidden">
              <h4 className="text-center text-lg pt-3 font-semibold pb-3 text-nowrap">
                <Link href={`/customers/all/${chalan?.customer?.id}`}>
                  {chalan?.customer?.name}
                </Link>
              </h4>

              {chalan?.customerProducts?.map((product) => {
                const totalAmount = product?.finishedProducts?.reduce(
                  (acc, item) => acc + item?.amount,
                  0
                );
                return (
                  <div
                    className="bg-slate-200/40 rounded-md p-2 mt-3 shadow-[4px_4px_2px_1px__#eee] border"
                    key={product?.id}
                  >
                    <p className=" font-semibold py-1">
                      <Link href={`/products/all/${product?.product?.id}`}>
                        {product?.product?.name}
                      </Link>
                    </p>
                    <p className="flex justify-between gap-2 items-center py-1">
                      <span title="Amount">{totalAmount}</span>
                      <span>x</span>
                      <span title="Rate">{product?.product_rate}</span>
                      <span>=</span>
                      <span title="Total">
                        {" "}
                        {product?.product_rate * totalAmount}
                      </span>
                    </p>
                  </div>
                );
              })}

              <div className="py-2 mt-4 bg-green-100/70 rounded-md p-2 flex gap-2 justify-between items-center">
                <p className=" font-semibold py-1">Total</p>
                <p className="flex justify-between gap-2 items-center py-1">
                  {totalChalanProductCost}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {!chalans?.length ? (
        <div className="py-2">
          <p className="text-red-500 font-medium text-center ">
            No product sell.
          </p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
