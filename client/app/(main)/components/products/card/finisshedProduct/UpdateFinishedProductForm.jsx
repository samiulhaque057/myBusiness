import SubmitLoader from "@/app/(main)/components/SubmitLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddFinishedDataToProductMutation,
  useUpdateMultipleFinishedDataToProductMutation,
} from "@/features/products/productApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import { toast } from "react-toastify";

export default function UpdateFinishedProductForm({ product, setOpen, type }) {
  const finished_products = product?.finished_products || [];

  const [fields, setFields] = useState(finished_products);

  const [updateFinishedProduct, { isLoading: isUpdateLoading }] =
    useUpdateMultipleFinishedDataToProductMutation();

  // add field
  const addField = () => {
    setFields((prev) => [...prev, null]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    unregister,
    reset,
  } = useForm();

  // remove field
  const removeField = (id, index) => {
    setFields(fields?.filter((item) => item.id !== id));

    unregister(`amount_${index}`);
    unregister(`color_${index}`);
    unregister(`colorCode_${index}`);
    unregister(`design_${index}`);
    reset();
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    e.isDefaultPrevented();
    e.isPropagationStopped();

    const values = Object.entries(data).reduce((acc, [key, value]) => {
      const [name, index] = key.split("_");

      if (name === "amount") {
        if (+value > 0) {
          acc[index] = {
            ...acc[index],
            ...product?.finished_products[index],
            amount: +value,
            color: data[`color_${index}`] || null,
            design: data[`design_${index}`] || null,
            colorCode:
              data[`colorCode_${index}`] === "#111111"
                ? null
                : data[`colorCode_${index}`],
          };
        }
      }
      return acc;
    }, []);

    const result = {
      productId: +product.id,
      finishedProducts: values?.filter((item) => item),
    };

    // if finishedProducts length zero
    if (!result?.finishedProducts?.length) {
      return toast.error("Add amount.");
    }

    updateFinishedProduct(result).then((response) => {
      if (response?.data?.success) {
        setOpen(false);
        toast.success("Successfully updated.");
      } else if (!response.error?.data?.success) {
        toast.error(response?.error?.data?.error?.message);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" space-y-2">
          {fields.map((item, index, all) => (
            <div
              key={index}
              className="group pt-[5px]  relative border rounded-md px-2 py-2 "
            >
              {item?.is_sold ? (
                ""
              ) : (
                <span
                  className="p-1 rounded-md bg-red-100  z-10 absolute right-0 cursor-pointer invisible group-hover:visible "
                  onClick={() => removeField(item?.id, index)}
                  disabled={true}
                >
                  <RxCrossCircled className="text-base   text-red-500 " />
                </span>
              )}

              <Label
                htmlFor="amount"
                className="pt-3 pb-2 flex relative justify-between font-semibold items-center"
              >
                <span className="relative">Amount-{index + 1}</span>
              </Label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label
                    htmlFor="amount"
                    className="pt-3 pb-2 flex relative justify-between font-medium items-center"
                  >
                    Value
                  </Label>
                  <Input
                    type="number"
                    id="amount"
                    step="0.01"
                    defaultValue={item?.amount || 0}
                    disabled={item?.is_sold}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    {...register(`amount_${index}`, {
                      min: 0,
                    })}
                  />

                  {errors[`amount_${index}`] && (
                    <p className="text-red-500 pt-[2px]">
                      {errors[`amount_${index}`].message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="design"
                    className="pt-3 pb-2 flex relative justify-between font-medium items-center"
                  >
                    Design
                  </Label>
                  <Input
                    type="text"
                    id="design"
                    disabled={item?.is_sold}
                    defaultValue={item?.design || ""}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    {...register(`design_${index}`, {})}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="color"
                    className="pt-3 pb-2 flex relative justify-between font-medium items-center"
                  >
                    Color
                  </Label>
                  <Input
                    type="text"
                    id="color"
                    disabled={item?.is_sold}
                    defaultValue={item?.color || null}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    {...register(`color_${index}`, {})}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="colorCode"
                    className="pt-3 pb-2 flex relative justify-between font-medium items-center"
                  >
                    Color Code
                  </Label>
                  <Input
                    type="color"
                    id="colorCode"
                    disabled={item?.is_sold}
                    defaultValue={item?.colorCode || "#111111"}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    {...register(`colorCode_${index}`, {})}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 justify-between items-center pt-4">
          <Button type="submit">
            <SubmitLoader label={"Update"} loading={isUpdateLoading} />
          </Button>
        </div>
      </form>
    </>
  );
}
