import React from "react";
import { numberToFixed, productShortage } from "../../helper";

export default function ProductInfo({ product }) {
  const shortage = productShortage(product) || 0;

  const costing =
    (product?.dyeing_rate &&
      product?.gray_rate &&
      product?.dyeing_rate + product?.gray_rate + Number(shortage)) ||
    0;

  return (
    <table className="w-full text-[14px]">
      <thead>
        <tr className="bg-slate-50 rounded-md">
          <th className="border border-collapse px-4 py-2">Gray</th>
          <th className="border border-collapse px-4 py-2">Dyeing</th>
          <th className="border border-collapse px-4 py-2">Shortage</th>
          <th className="border border-collapse px-4 py-2">Costing</th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr className="hover:bg-slate-50">
          <td className="border border-collapse px-4 py-2">
            {product?.gray?.name}
          </td>
          <td className="border border-collapse px-4 py-2">
            {product?.dyeing?.name}
          </td>
          <td
            className="border border-collapse px-4 py-2 text-center"
            rowSpan={2}
          >
            {shortage}
          </td>
          <td className="border border-collapse px-4 py-2" rowSpan={2}>
            {costing}
          </td>
        </tr>
        <tr className="hover:bg-slate-50">
          <td className="border border-collapse px-4 py-2 text-center">
            {numberToFixed(product?.gray_rate)}
          </td>
          <td className="border border-collapse px-4 py-2 text-center">
            {numberToFixed(product?.dyeing_rate)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
