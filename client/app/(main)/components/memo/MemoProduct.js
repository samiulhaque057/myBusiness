import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useGetAllProductsQuery } from "@/features/products/productApi";
import Select from "react-select";
import RateAskInfo from "./card/RateAskInfo";
import SelectFinishedAmount from "./card/SelectFinishedAmount";
import ProductInfo from "./card/ProductInfo";
import { useState } from "react";

export default function MemoProduct({
  setAllSelectedProducts,
  setOpen,
  allSelectedProducts,
}) {
  const { data: { data: products = [] } = {}, refetch } =
    useGetAllProductsQuery();

  // products names for search and remove if product are selected
  const productNames = products
    ?.map((product) => ({
      value: product.id,
      label: product.name,
      id: product.id,
    }))
    .filter(
      (product) => !allSelectedProducts?.some((p) => p.id === product.id)
    );

  const [product, setProduct] = useState(
    // set default product and remove if product are selected
    productNames[0]
      ? products?.find((product) => product.id === productNames[0].id)
      : null
  );

  return (
    <div>
      {/* search product  */}
      <div>
        <div className="">
          <div className="flex items-center space-x-4">
            <Select
              className="basic-single w-full"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              defaultValue={productNames[0]}
              isClearable={true}
              isSearchable={true}
              placeholder="Search product by name."
              name="color"
              options={productNames}
              onChange={(e) => {
                if (e?.value) {
                  const selectedProduct = products?.find(
                    (product) => product.id === e.id
                  );
                  setProduct(selectedProduct);
                } else {
                  setProduct(null);
                }
              }}
            />
            <Button type="submit"> {"Search"} </Button>
          </div>

          {/* product details  */}

          {product && (
            <div className="py-4">
              <div>
                <h3 className="text-2xl font-semibold text-center pt-2">
                  <span>{product?.name} </span>
                </h3>
              </div>

              {/* dyeing gray  */}
              <div className="py-5">
                <ProductInfo product={product} />
              </div>

              <div className="flex  justify-between gap-4 flex-wrap">
                {/* select finished amount  */}
                <SelectFinishedAmount
                  product={product}
                  setOpen={setOpen}
                  refetch={refetch}
                  setAllSelectedProducts={setAllSelectedProducts}
                  allSelectedProducts={allSelectedProducts}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
