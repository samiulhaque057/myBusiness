import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LuMinusCircle } from "react-icons/lu";
import { IoAddCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { useAddFinishedDataToProductMutation } from "@/features/products/productApi";
import { toast } from "react-toastify";

export const Field = ({ index, removeField, form, showBorder }) => {
  return (
    <div className="group" key={index}>
      <p className=" flex items-center gap-2 justify-between h-10  ">
        <span>Thaan-{index ? index + 1 : 1}</span>
        {removeField && (
          <Button
            className="bg-transparent h-fit text-black px-1.5 hover:bg-transparent hover:text-red-400  hidden group-hover:block"
            onClick={() => {
              removeField(index - 1);
            }}
          >
            <LuMinusCircle className="text-xl" />
          </Button>
        )}
      </p>
      <div className={`${showBorder ? "border-b" : ""} flex    pb-4`}>
        <FormField
          control={form.control}
          name={`amount-${index ? index + 1 : 1}`}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Amount</FormLabel> */}
              <FormControl>
                <Input
                  className="   focus-visible:ring-0 rounded-none rounded-l-md focus-visible:ring-offset-0 focus:border-slate-400/80"
                  type="number"
                  defaultValue={0}
                  min={0}
                  placeholder="Thaan amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`defect-${index ? index + 1 : 1}`}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Defect</FormLabel> */}
              <FormControl>
                <Input
                  className=" rounded-none rounded-r-md  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  type="number"
                  min={0}
                  defaultValue={0}
                  placeholder="Thaan defect"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default function ThaanCountForm({ type, formData }) {
  const [addThaan, { isLoading }] = useAddFinishedDataToProductMutation();

  const [fields, setFields] = useState([]);

  // add field
  const addField = () => {
    setFields((prev) => setFields([...prev, Field]));
  };

  // remove field
  const removeField = (index) => {
    setFields((prev) => {
      const newFields = [...prev];
      newFields.splice(index, 1);
      return newFields;
    });
  };

  const form = useForm({
    defaultValues: {},
  });

  const onSubmit = async (values) => {
    const filterData = [];

    const maxIterate = fields?.length ? fields.length + 1 : 1;

    for (let i = 1; i <= maxIterate; i++) {
      const amount = +values[`amount-${i}`];
      const defect = +values[`defect-${i}`];
      if (amount) {
        filterData.push({
          amount,
          defect: defect || 0,
          productId: formData?.id,
        });
      }
    }
    // console.log(formData);
    const data = {
      productId: formData.id,
      thaanData: filterData,
    };

    const response = await addThaan(data);

    if (response?.data?.success) toast.success(response.data?.message);
    else if (!response.error?.data?.success)
      toast.error(response?.error?.data?.error?.message);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 w-full"
        >
          <Field form={form} showBorder={fields?.length ? true : false} />

          {fields?.map((Field, index, array) => (
            <Field
              key={index}
              index={index + 1}
              removeField={array.length - 1 === index && removeField}
              form={form}
              showBorder={array.length - 1 === index ? false : true}
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
      </Form>
    </>
  );
}
