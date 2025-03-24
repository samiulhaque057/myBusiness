"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BuyProduct from "../../components/memo/card/BuyProduct";
import SelectedProduct from "../../components/memo/card/SelectedProduct";
import CountCost from "../../components/memo/card/CountCost";
import PaymentCount from "../../components/memo/card/PaymentCount";

export default function SingleMemo({
  payment: paymentData,
  products = [],
  customer,
  chalan,
}) {
  const [allSelectedProducts, setAllSelectedProducts] = useState(products);

  const [payment, setPayment] = useState(paymentData);

  useEffect(() => {
    setAllSelectedProducts(products);
  }, [products]);

  return (
    <div className="py-4">
      <Card>
        <CardContent className="p-0">
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-full rounded-lg"
          >
            <ResizablePanel defaultSize={50} minSize={30} className="pb-3 ">
              <div className="w-full ">
                <h2 className="text-xl font-medium bg-slate-100 text-center py-2">
                  Products
                </h2>
                <div
                  className={` ${
                    allSelectedProducts?.length
                      ? "justify-between"
                      : " justify-center"
                  } px-3 py-4 flex gap-6 `}
                >
                  <div>
                    {/* if product found add button show up  */}
                    <div
                      className={
                        allSelectedProducts?.length ? "pb-3" : "hidden"
                      }
                    >
                      <BuyProduct
                        setAllSelectedProducts={setAllSelectedProducts}
                        allSelectedProducts={allSelectedProducts}
                      />
                    </div>
                    <div
                      className=" flex justify-between items-center  gap-x-6 gap-y-8 w-full
                      "
                    >
                      {/* products  */}
                      <div className=" flex-1 ">
                        <SelectedProduct
                          allSelectedProducts={allSelectedProducts}
                          setAllSelectedProducts={setAllSelectedProducts}
                          type="update"
                        />
                        {!allSelectedProducts?.length && (
                          <p className=" text-red-500 py-3 text-center">
                            No product selected
                          </p>
                        )}
                      </div>
                      <div
                        className={allSelectedProducts?.length ? "hidden" : ""}
                      >
                        <BuyProduct
                          setAllSelectedProducts={setAllSelectedProducts}
                          allSelectedProducts={allSelectedProducts}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} className="pb-3">
              <div className="w-full">
                <h2 className="text-xl font-medium bg-slate-100 text-center py-2">
                  Count
                </h2>
                <div className="px-3 py-4 flex flex-col gap-6 justify-between">
                  <CountCost allSelectedProducts={allSelectedProducts} />
                  <div>
                    <PaymentCount
                      allSelectedProducts={allSelectedProducts}
                      setPayment={setPayment}
                      payment={{
                        ...payment,
                        paymentData,
                      }}
                      customer={customer}
                      setAllSelectedProducts={setAllSelectedProducts}
                      type={"update"}
                      chalan={chalan}
                    />
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
}
