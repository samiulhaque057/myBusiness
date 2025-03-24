import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetAllGraysQuery } from "@/features/gray/grayApi";
import { format, formatISO } from "date-fns";
import { useForm } from "react-hook-form";
import ProductField from "./ProductField";
import { useState } from "react";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateGrayDyeingProductMutation } from "@/features/products/productApi";
import SubmitLoader from "../SubmitLoader";
import { RiTestTubeFill } from "react-icons/ri";

export default function BuyProduct({ setOpen, refetchGrays, date }) {
  const { data: grays, refetch } = useGetAllGraysQuery();
  const [createGrayDyeingProduct, { isLoading }] =
    useCreateGrayDyeingProductMutation();
  const [fields, setFields] = useState([null]);
  const [grayName, setGrayName] = useState("");
  const [grayId, setGrayId] = useState("");

  const grayNames = grays?.data.map((dt) => {
    return {
      value: dt.name,
      label: dt?.name,
      id: dt.id,
    };
  });

  let values = {};
  for (let i = 1; i <= 8; i++) {
    values[`product_${i}`] = "";
    values[`amount_${i}`] = "";
    values[`rate_${i}`] = "";
    values[`dyeing_name_${i}`] = "";
    values[`dyeing_id_${i}`] = "";
  }

  const form = useForm({
    defaultValues: {
      gray_name: "",
      gray_date: "",
      gray_address: "",
      gray_phone: "",
      ...values,
    },
  });

  const removeField = () => {
    setFields((prev) => {
      const newFields = [...prev];
      form.setValue(`product_${newFields.length}`, "");
      form.setValue(`amount_${newFields.length}`, 0);
      form.setValue(`rate_${newFields.length}`, 0);
      form.setValue(`dyeing_name_${newFields.length}`, "");

      newFields.pop();
      return newFields;
    });
  };

  const onSubmit = async (values) => {
    const { gray_name, product_1, amount_1, rate_1, dyeing_id_1 } = values;

    const gray = grays?.data?.find((data) => data.id === grayId);

    if (!gray_name) return toast.error("Gray name is required!!");

    if (!gray) {
      if (!values.gray_address) return toast.error("Gray Address is required!");
      else if (!values.gray_phone)
        return toast.error("Gray Phone number is required!");
      else if (grays?.data?.find((data) => data.phone === values.gray_phone)) {
        return toast.error("Phone number already exist.");
      }
    }

    if (!product_1) return toast.error("Product-1 name is required!!");
    if (!amount_1) return toast.error("Product-1 amount is required!!");
    if (!rate_1) return toast.error("Product-1 rate is required!!");
    if (!dyeing_id_1) return toast.error("Dyeing name is required!");

    const products = [];

    let isError = false;
    Object.keys(values)
      .filter((data) => data.includes("product_") && values[data])
      .map((data, indexValue, array) => {
        const index = data.split("_")[1];
        const product = {
          name: values[`product_${index}`],
          gray_amount: +values[`amount_${index}`],
          gray_rate: +values[`rate_${index}`],
          dyeing_name: values[`dyeing_name_${index}`],
          dyeingId: values[`dyeing_id_${index}`],
        };

        if (!product.name) {
          isError = true;
          return toast.error(`Gray-${index} name is required!`);
        } else if (!product.gray_amount) {
          isError = true;
          return toast.error(`Gray-${index} amount is required!`);
        } else if (!product.gray_rate) {
          isError = true;
          return toast.error(`Gray-${index} rate is required!`);
        } else if (!product.dyeingId) {
          isError = true;
          return toast.error(`Dyeing-${index} name is required!`);
        }

        if (array.length - 1 === indexValue) {
          isError = false;
        }
        products.push(product);
      });

    if (isError) return;

    const data = {
      gray_name,
      gray_address: gray?.address || values.gray_address,
      gray_phone: gray?.phone || values.gray_phone,
      date: formatISO(date).split("T")[0],
      products,
    };

    createGrayDyeingProduct(data)
      .then((res) => {
        if (res?.data?.success) {
          refetch();
          refetchGrays();
          form.reset();
          setOpen(false);
          setGrayName("");
          toast.success("Successfully purchase.");
        }
      })
      .catch((err) => {
        toast.error(err?.data?.error?.message);
      });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
          {/* dyeing   */}
          <div
            className={`${fields?.length ? "border-b pb-4 " : ""} space-y-4`}
          >
            <div>
              <Label className="font-semibold">Gray Company</Label>
              <CreatableSelect
                isClearable
                options={grayNames}
                className="mt-2"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? "#a9b5c6" : "#e2e8f0",
                  }),
                }}
                onChange={(value) => {
                  form.setValue(`gray_name`, value?.value);
                  const gray = grayNames.find((data) => data.id === value?.id);

                  if (!gray) {
                    form.setValue(`gray_address`, "");
                    form.setValue(`gray_phone`, "");
                  }
                  setGrayName(value?.value);
                  if (value?.id) {
                    setGrayId(value?.id);
                  } else {
                    setGrayId("");
                  }
                }}
              />
            </div>

            <>
              {grayName && !grayNames?.find((data) => data.id === grayId) && (
                <>
                  <FormField
                    control={form.control}
                    name={"gray_address"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gray Address </FormLabel>
                        <FormControl>
                          <Input
                            className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                            placeholder="Enter gray address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"gray_phone"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gray Phone </FormLabel>
                        <FormControl>
                          <Input
                            className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                            placeholder="Enter gray address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </>
          </div>

          {/* product*/}
          {fields?.map((dt, index, array) => {
            return (
              <ProductField
                form={form}
                key={index}
                index={index + 1}
                removeField={
                  array?.length - 1 === index && index > 0 ? removeField : null
                }
                showBorder={array?.length - 1 === index ? false : true}
              />
            );
          })}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              className="m-2 bg-transparent border text-black active:scale-95 hover:bg-black/5"
              onClick={() => {
                setFields([...fields, null]);
              }}
            >
              {"Add Product"}
            </Button>
            <Button type="submit">
              <SubmitLoader label={"Submit"} loading={isLoading} />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
