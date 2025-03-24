import { useEffect, useState } from "react";

import TableDyeing from "./TableDyeing";

export default function SingleDyeingTable({ data }) {
  const [updatedData, setUpdatedData] = useState(data);

  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  return (
    <div className="pt-2">
      <div className="rounded-md ">
        <div className="overflow-auto rounded-md pb-2   relative w-full ">
          <table className="w-full border-t border-x   caption-bottom text-sm">
            <thead className="[&_tr]:border-b  bg-slate-50">
              <tr className="border-b  z-10 transition-colors  hover:bg-slate-100/50   dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Gray Date
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Dyeing Date
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Chalan
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Product
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Amount / Order
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Thaan Amount / dyeing amount
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Difference
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Rate
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Total
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Payment Date
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Payment Amount
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Total Payment Done
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Due
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Payment Status
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Progress
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Gray Name
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Gray Payment
                </th>
              </tr>
            </thead>
            {updatedData?.products.length ? (
              <tbody>
                <TableDyeing dyeingData={updatedData} />
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={16} className="px-4 h-24 text-center">
                    No product found.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
