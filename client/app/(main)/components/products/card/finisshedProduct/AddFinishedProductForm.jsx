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

export default function AddFinishedProductForm({ product, setOpen, type }) {
  const [fields, setFields] = useState([null]);

  const [addFinishedProduct, { isLoading }] =
    useAddFinishedDataToProductMutation();
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
  } = useForm();

  // remove field
  const removeField = (index) => {
    setFields((prev) => {
      const newFields = [...prev];
      newFields.splice(index, 1);
      return newFields;
    });
    unregister(`amount_${index}`);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (fields.length - 1 === index) {
        addField();
        setTimeout(() => {
          document.getElementById(`amount_${index + 1}`).focus();
        }, 100);
      } else {
        document.getElementById(`amount_${index + 1}`).focus();
      }
    }
  };

  const [inputs, setInputs] = useState({
    color: "",
    colorCode: "",
    design: "",
  });

  const onSubmit = (data) => {
    if (!inputs.colorCode) return toast.error("Color Code is required!");

    const values = Object.entries(data).reduce((acc, [key, value]) => {
      const [name, index] = key.split("_");

      if (name === "amount") {
        if (+value > 0) {
          acc[index] = {
            ...acc[index],
            ...product?.finished_products[index],
            amount: +value,
            color: inputs?.color ? inputs.color : null,
            design: inputs?.design ? inputs.design : null,
            colorCode: inputs.colorCode ? inputs.colorCode : null,
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

    if (type === "update") {
      updateFinishedProduct(result).then((response) => {
        if (response?.data?.success) {
          setOpen(false);
          toast.success(response.data?.message);
        } else if (!response.error?.data?.success) {
          toast.error(response?.error?.data?.error?.message);
        }
      });
    } else if (type === "add") {
      addFinishedProduct(result).then((response) => {
        if (response?.data?.success) {
          setOpen(false);
          toast.success(response.data?.message);
        } else if (!response.error?.data?.success) {
          toast.error(response?.error?.data?.error?.message);
        }
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* color  */}
        <div className="flex gap-1">
          <div className="group pt-1 w-full">
            <Label
              htmlFor="color"
              className={`pt-3 pb-2 flex font-semibold relative justify-between items-center`}
            >
              <span className="relative">Color</span>
            </Label>

            <Input
              type="text"
              value={inputs?.color}
              className={` focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80  `}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  color: e.target.value,
                }));
              }}
            />
          </div>
          <div className="group pt-1 w-full">
            <Label
              htmlFor="design"
              className={`pt-3 pb-2 flex relative justify-between items-center font-semibold`}
            >
              <span className="relative">Design</span>
            </Label>

            <Input
              type="text"
              value={inputs.design}
              className={` focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80  `}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  design: e.target.value,
                }));
              }}
            />
          </div>
          <div className="group pt-1 w-full">
            <Label
              htmlFor="color_code"
              className={`pt-3 pb-2 flex relative justify-between items-center font-semibold`}
            >
              <span className="relative">Color Code</span>
            </Label>

            <Input
              type="color"
              value={inputs?.colorCode}
              className={` focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80  py-1 px-1 `}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  colorCode: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="pt-4">
          <hr />
        </div>

        {/* color  */}

        <div className=" grid grid-cols-2 gap-2  ">
          {fields.map((item, index, all) => (
            <div key={index} className="group pt-[3px]">
              <Label
                htmlFor="amount"
                className={`${
                  errors[`amount_${index}`] ? "text-red-500" : ""
                } pt-3 pb-2 flex relative justify-between font-semibold items-center`}
              >
                <span className="relative">Amount-{index + 1}</span>
                {all.length - 1 === index && index > 0 && (
                  <span
                    className="p-1 rounded-md bg-red-100 absolute right-0 cursor-pointer invisible group-hover:visible "
                    onClick={() => removeField(index)}
                  >
                    <RxCrossCircled className="text-base   text-red-500 " />
                  </span>
                )}
              </Label>

              <Input
                type="number"
                id={`amount_${index}`}
                step="0.01"
                defaultValue={item?.amount || 0}
                className={` focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80 ${
                  errors[`amount_${index}`]
                    ? "border-red-400 focus:border-red-400"
                    : ""
                } `}
                {...register(`amount_${index}`, {
                  required: "Amount is required",
                  min: 0,
                })}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />

              {errors[`amount_${index}`] && (
                <p className="text-red-500 pt-[2px]">
                  {errors[`amount_${index}`].message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-6 justify-between items-center py-4">
          <Button
            type="button"
            onClick={addField}
            className="bg-transparent border hover:bg-black/5 text-black"
          >
            Add Field
          </Button>

          <Button type="submit">
            {type === "update" ? (
              <SubmitLoader label={"Update"} loading={isUpdateLoading} />
            ) : (
              <SubmitLoader label={"Submit"} loading={isLoading} />
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
