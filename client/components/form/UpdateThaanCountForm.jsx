import React, { useState } from "react";
import { Button } from "../ui/button";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuMinusCircle } from "react-icons/lu";
import { toast } from "react-toastify";
import { useUpdateMultipleFinishedDataToProductMutation } from "@/features/products/productApi";

const Field = ({ index, defaultValue, showBorder, removeField, length }) => {
  return (
    <div className="group">
      <p className=" flex items-center gap-2 justify-between h-10  ">
        <span>Thaan-{index}</span>
        {removeField && (
          <Button
            className="bg-transparent h-fit text-black px-1.5 hover:bg-transparent hover:text-red-400  hidden group-hover:block"
            onClick={() => {
              removeField(index - length - 1);
            }}
          >
            <LuMinusCircle className="text-xl" />
          </Button>
        )}
      </p>
      <div className={`${showBorder ? "border-b" : ""}  flex pb-4`}>
        <div className="space-y-2">
          <input
            className="flex h-10 w-full border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 focus-visible:ring-0 rounded-none rounded-l-md focus-visible:ring-offset-0 focus:border-slate-400/80"
            min={0}
            placeholder="Thaan amount"
            type="number"
            defaultValue={defaultValue?.amount}
            name={`amount-${index}`}
          />
        </div>
        <div className="space-y-2">
          <input
            className="flex h-10 w-full border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
            min={0}
            placeholder="Thaan defect"
            type="number"
            defaultValue={defaultValue?.defect}
            name={`defect-${index}`}
          />
        </div>
      </div>
    </div>
  );
};

export default function UpdateThaanCountForm({ formData }) {
  const [fields, setFields] = useState([]);

  const [updateMultipleThaan] =
    useUpdateMultipleFinishedDataToProductMutation();

  // add field
  const addField = () => {
    if (!fields?.length) {
      setFields([Field]);
    } else {
      setFields((prev) => setFields([...prev, Field]));
    }

    // setFields((prev) => setFields([...prev, Field]));
  };

  // remove field
  const removeField = (index) => {
    setFields((prev) => {
      const newFields = [...prev];
      newFields.splice(index, 1);
      return newFields;
    });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formFieldData = new FormData(e.target);

    const data = Object.fromEntries(formFieldData);

    // not empty formData amount value
    formData?.thaan_count.map((thaan, index) => {
      if (!data[`amount-${index + 1}`]) {
        toast.error(`In thaan-${index + 1}, amount value can't zoro.`);
      }
    });

    const filterData = [];
    const maxIterate = Object.keys(data).length / 2;

    console.log(data);

    for (let i = 0; i < maxIterate; i++) {
      const amount = +data[`amount-${i + 1}`];
      const defect = +data[`defect-${i + 1}`];
      if (amount) {
        filterData.push({
          amount,

          defect: defect || 0,
          productId: formData?.id,
          id: formData?.thaan_count[i].id,
        });
      }
    }

    // filter before and new data
    const beforeData = filterData?.filter((data) => data.id);
    const newData = filterData?.filter((data) => !data.id);

    const catoriesData = {
      productId: formData.id,
      newData,
      beforeData,
    };

    const response = await updateMultipleThaan(catoriesData);

    if (response?.data?.success) toast.success(response.data?.message);
    else if (!response.error?.data?.success)
      toast.error(response?.error?.data?.error?.message);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {formData?.thaan_count?.map((thaan, index, array) => (
          <Field
            key={thaan?.id}
            index={index + 1}
            defaultValue={{
              amount: thaan?.amount,
              defect: thaan?.defect,
            }}
            showBorder={
              fields?.length ? true : array?.length - 1 === index ? false : true
            }
            removeField={false}
          />
        ))}
        {fields?.map((Field, index, array) => (
          <Field
            key={index}
            index={index + formData?.thaan_count?.length + 1}
            defaultValue={{
              amount: 0,
              defect: 0,
            }}
            removeField={array?.length - 1 === index && removeField}
            showBorder={array?.length - 1 === index ? false : true}
            length={formData?.thaan_count?.length}
          />
        ))}
        <div className="flex gap-8 justify-between items-center pt-3">
          <Button
            onClick={() => addField()}
            type="button"
            className="bg-transparent border text-slate-500 bg-slate-50 hover:bg-slate-200  flex gap-1 items-center "
          >
            <IoAddCircleOutline className="text-lg" />
            <span>Add Field</span>
          </Button>
          <Button type="submit"> {"Submit"} </Button>
        </div>
      </form>
    </>
  );
}
