"use client";
import { useEffect, useState } from "react";

import TableGray from "./TableGray";

export default function SingleGrayTable({ data }) {
  const [updatedData, setUpdatedData] = useState(data);

  const handleSorting = () => {
    const sorted =
      grayData?.id &&
      [...grayData?.products]?.sort((a, b) => {
        if (a?.gray_date > b?.gray_date) {
          return a?.gray_date > b?.gray_date;
        } else {
          return a?.gray_date < b?.gray_date;
        }
      });

    setUpdatedData({
      ...grayData,
      products: sorted,
    });
  };

  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  return (
    <div className="pt-2">
      <div className="rounded-md ">
        <div className=" overflow-auto rounded-md pb-2   relative w-full ">
          <table className="w-full border-t border-x   caption-bottom text-sm">
            <thead className="[&_tr]:border-b  bg-slate-50">
              <tr className="border-b  z-10 transition-colors  hover:bg-slate-100/50   dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                <th
                  className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium flex items-center hover:text-black text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400 cursor-pointer"
                  onClick={() => handleSorting()}
                >
                  Date
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-up-down ml-2 h-3.5 w-3.5"
                  >
                    <path d="m21 16-4 4-4-4"></path>
                    <path d="M17 20V4"></path>
                    <path d="m3 8 4-4 4 4"></path>
                    <path d="M7 4v16"></path>
                  </svg>
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Chalan
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Product
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Amount
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
                  Delivery Status
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Dyeing Name
                </th>
                <th className="text-nowrap border-r  border-collapse h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                  Give Payment
                </th>
              </tr>
            </thead>
            {updatedData?.products.length ? (
              <tbody>
                <TableGray grayData={updatedData} />
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
          </table>
        </div>
      </div>
    </div>
  );
}
