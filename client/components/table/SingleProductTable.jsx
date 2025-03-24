"use client";

import HtmlContent from "./HtmlContent";
import productTableData from "./productTableData";
import TableProduct from "./TableProduct";

const datas = {
  id: 1,
  name: "product-1", // product
  grayId: 1,
  gray_amount: 120, // gray lot
  gray_rate: 15,
  gray_date: null, // gray_memo_date
  gray: {
    name: "Gray-1", // gray company
  },
  dyeing: {
    dyeing: "Dyeing-1", // dyeing company
  },
  gray_payment_status: false,
  dyeingId: 1,
  dyeing_date: null, // dyeing_memo_date
  dyeing_rate: null,
  dyeing_payment_status: false,
  dyeing_amount: 195, // receive from dyeing
  //   thaan_amount: null, // thaan amount
  delivery_status: null,
  chalanNumber: 1, // chalan
  //   difference_from_gray : thaan_amount-gray_amount
  thaan_count: [
    {
      id: 1,
      amount: 12, // thaan count
      defect: 2, // defect count
      is_sold: true,
    },
    {
      id: 2,
      amount: 22,
      defect: 1,
      is_sold: true,
    },
  ],
  //   diffrence_from_gray_lot: thaan_amount -gray_lot
  //   difference_from_dyeing_lot: thaan_amount -receive_from_dyeing
  //   total_defect:  from thaan
};

export default function SingleGrayTable({ data }) {
  return (
    <div className="pt-10">
      <div className="rounded-md ">
        <div className=" overflow-auto rounded-md pb-2   relative w-full ">
          <table className="w-full border-t border-x   caption-bottom text-sm">
            <thead className="[&_tr]:border-b  bg-slate-50">
              <tr className="border-b  z-10 transition-colors  hover:bg-slate-100/50   dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium flex items-center hover:text-black text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400 cursor-pointer">
                  Gray Memo Date
                </th>

                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Dyeing Memo Date
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Gray Company
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Dyeing Company
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Chalan
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Product
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Gray Lot
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Received From Gray
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Difference From Gray
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Thaan Count
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Defect Count
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Thaan Amount
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Difference From Gray Lot
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Difference From Dyeing Lot
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Total Defect
                </th>
              </tr>
            </thead>

            {data?.id ? (
              <tbody>
                <TableProduct productData={data} />
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={13} className="px-4 h-24 text-center">
                    No product found.
                  </td>
                </tr>
              </tbody>
            )}

            {/* <HtmlContent html={productTableData(datas)} /> */}
          </table>
        </div>
      </div>
    </div>
  );
}
