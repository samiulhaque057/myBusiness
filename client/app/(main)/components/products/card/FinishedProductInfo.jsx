import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MdUpdate } from "react-icons/md";
import AddFinishedProduct from "./AddFinishedProduct";
import AddDefectForm from "./AddDefectForm";
import UpdateFinishedProductForm from "./finisshedProduct/UpdateFinishedProductForm";
import { getContrastColor } from "../../helper";
export default function FinishedProductInfo({ product }) {
  const [open, setOpen] = useState(false);

  const colorCodeWiseGroupFinishedProducts = Object.groupBy(
    product?.finished_products,
    (item) => item.colorCode
  );

  const colorCodeGroupNameKeyArray = Object.keys(
    colorCodeWiseGroupFinishedProducts
  );

  // codeCodeName array replace by color name
  const groups = colorCodeGroupNameKeyArray.map((code) => {
    return {
      code,
      name: colorCodeWiseGroupFinishedProducts[code][0]?.color,
    };
  });

  const [checked, setChecked] = useState(colorCodeGroupNameKeyArray[0]);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-100 rounded-t-md py-3">
        <CardTitle className="text-center flex justify-between items-center">
          <span>Finished Product</span>

          <div className="flex gap-1 justify-center">
            <div
              className={`${!product?.finished_products?.length && "hidden"}`}
            >
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  className="py-2 h-8 rounded-md flex items-center px-3  bg-white active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400 disabled:bg-black/5 disabled:text-slate-400  border"
                  title="Update Finished Product"
                >
                  <MdUpdate className="text-base" />
                </DialogTrigger>
                <DialogContent className="overflow-scroll ">
                  <DialogHeader>
                    <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                      Update Finished Product
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <UpdateFinishedProductForm
                    type={"update"}
                    setOpen={setOpen}
                    product={product}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <AddFinishedProduct product={product} />
            <AddDefectForm
              type={product?.total_defected ? "update" : "add"}
              data={{
                defect: product?.total_defected,
                id: product?.id,
              }}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div>
          <div className="h-full w-full flex justify-center  items-center pb-3 ">
            <div className="flex flex-wrap  gap-4 h-fit  items-center justify-center px-2  ">
              <p className="flex items-center justify-center h-fit gap-1 flex-col border p-2 w-[70px] text-sm rounded-md bg-green-50">
                <span className="font-semibold">Stock</span>
                <span>
                  {product?.finished_products.reduce((acc, item) => {
                    if (!item.is_sold) {
                      acc += item.amount;
                    }
                    return acc;
                  }, 0)}
                </span>
              </p>
              <p className="flex items-center h-fit justify-center gap-1 flex-col border p-2 w-[70px] text-sm rounded-md bg-slate-50">
                <span className="font-semibold">Sold</span>
                <span>
                  {product?.finished_products.reduce((acc, item) => {
                    if (item.is_sold) {
                      acc += item.amount;
                    }
                    return acc;
                  }, 0)}
                </span>
              </p>
              <p className="flex h-fit w-[70px] items-center justify-center gap-1 flex-col border p-2 text-sm rounded-md bg-red-50">
                <span className="font-semibold">Defect</span>
                <span>{product?.total_defected || 0}</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-center w-full gap-2 pb-2 px-4">
              {groups
                ?.sort((a, b) => {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                })
                ?.map((tab, index) => {
                  return (
                    <label
                      key={index}
                      className={` py-1 px-2 text-[12px] font-semibold rounded-md  border cursor-pointer ${
                        checked === tab?.code ? "ring-2 ring-offset-2" : ``
                      }`}
                      style={{
                        backgroundColor: tab?.code,
                        color: getContrastColor(tab.code),
                      }}
                    >
                      <input
                        type="checkbox"
                        value={tab?.code}
                        className="hidden"
                        onChange={(e) => setChecked(e.target.value)}
                      />
                      {tab?.name || tab?.code}
                    </label>
                  );
                })}
            </div>
            <div className="pt-4 px-4">
              {Object?.keys(
                Object?.groupBy(
                  colorCodeWiseGroupFinishedProducts[checked] || [],
                  (item) => item?.design?.toUpperCase()
                )
              )?.map((design, i) => {
                const designItems = Object.groupBy(
                  colorCodeWiseGroupFinishedProducts[checked],
                  (item) => item?.design?.toUpperCase()
                )[design];
                return (
                  <div key={i} className="block w-full mb-4">
                    <div className="flex gap-3 items-center pb-4">
                      <span className="text-gray-600 font-bold block capitalize ">
                        {design === "undefined" ? "No Design" : design}

                        <span className="px-1 font-medium">
                          ({designItems?.length})
                        </span>
                      </span>
                      <p className="text-[11px] bg-green-100 py-2 px-3 rounded-md font-semibold">
                        <span>Stock </span>
                        <span>
                          {designItems.reduce((acc, item) => {
                            if (!item.is_sold) {
                              acc += item.amount;
                            }
                            return acc;
                          }, 0)}
                        </span>
                      </p>
                      <p className="text-[11px] bg-blue-100/70 py-2 px-3 rounded-md font-semibold">
                        <span>Sold </span>
                        <span>
                          {designItems.reduce((acc, item) => {
                            if (item.is_sold) {
                              acc += item.amount;
                            }
                            return acc;
                          }, 0)}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-x-4 gap-y-3 items-center flex-wrap ">
                      {designItems
                        ?.sort((a, b) => a?.amount - b?.amount)
                        ?.map((dt) => (
                          <span
                            className={`${
                              dt?.is_sold ? "bg-red-100 " : "bg-slate-50/50"
                            } border min-w-12 px-1 text-[16px] h-12 text-gray-600  rounded-md flex items-center justify-center`}
                            key={dt.id}
                          >
                            {dt?.amount}
                          </span>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* if finished_products is empty  */}
            {!product?.finished_products?.length && (
              <p className="text-center w-full text-red-500">
                No Finished Product
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
