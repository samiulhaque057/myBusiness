import { numberToFixed, productShortage } from "@/app/(main)/components/helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LuCalendarDays } from "react-icons/lu";

export default function ProductInfo({ product }) {
  // finished product
  const finishedProduct = numberToFixed(
    product?.finished_products?.reduce((acc, product) => {
      acc += product?.amount;
      return acc;
    }, 0)
  );

  // sortage furmula
  const shortage = productShortage(product);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-100 rounded-t-md py-3">
        <CardTitle className="text-center flex justify-between items-center">
          <span>Product</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Gray Amount </span>
            <span>{numberToFixed(product?.gray_amount)}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Dyeing Amount</span>
            <span>{numberToFixed(product?.dyeing_amount || 0)}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Finished Product</span>
            <span>{finishedProduct || 0}</span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Gray-dyeing difference</span>
            <span>
              {(product?.dyeing_amount &&
                product?.gray_amount &&
                numberToFixed(product?.gray_amount - product?.dyeing_amount)) ||
                0}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">
              Gray-finished_product difference
            </span>
            <span>
              {product?.gray_amount &&
                numberToFixed((product?.gray_amount || 0) - finishedProduct)}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">
              Dyeing-finished_product difference
            </span>
            <span>
              {(product?.dyeing_amount &&
                numberToFixed(
                  (product?.dyeing_amount || 0) - finishedProduct
                )) ||
                0}
            </span>
          </p>

          <p className="flex items-center justify-between gap-4 bg-slate-50 py-1 px-3 rounded-md">
            <span className="font-medium">Shortage</span>
            <span>{shortage}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
