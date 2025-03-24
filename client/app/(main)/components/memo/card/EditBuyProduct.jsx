import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetProductByIdQuery } from "@/features/products/productApi";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProductInfo from "./ProductInfo";
import RateAskInfo from "./RateAskInfo";
import EditSelectedFinishedAmount from "./EditSelectedFinishedAmount";

export default function EditBuyProduct({
  product,
  setAllSelectedProducts,
  type,
  allSelectedProducts,
}) {
  const [open, setOpen] = useState();

  const { data: { data: originalProduct = {} } = {}, isLoading } =
    useGetProductByIdQuery(product.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <FaRegEdit className="text-base text-blue-300 hover:text-blue-500 rounded-sm" />
      </DialogTrigger>
      <DialogContent className="overflow-scroll  md:min-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
            Edit Purchase Product
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="py-4">
            <div>
              <h3 className="text-2xl font-semibold text-center py-2">
                <span>{originalProduct?.name} </span>
              </h3>
            </div>

            {/* dyeing gray  */}
            <div className="py-5">
              <ProductInfo product={originalProduct} />
            </div>

            <div className="">
              {/* select finished amount  */}
              <EditSelectedFinishedAmount
                product={product}
                originalProduct={originalProduct}
                setOpen={setOpen}
                type={type}
                setAllSelectedProducts={setAllSelectedProducts}
                allSelectedProducts={allSelectedProducts}
              />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
