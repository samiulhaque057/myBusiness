import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useUpdateDyeingChalanProductsMutation } from "@/features/dyeing/dyeingApi";
import { toast } from "react-toastify";
import { log } from "util";

export default function EditDyeingCard({ products, setOpen }) {
  const [updateProducts] = useUpdateDyeingChalanProductsMutation();

  const defaultValues = products?.reduce(
    (acc, product, index) => {
      acc[`name__${index}`] = product?.name || "";
      acc[`dyeing_amount__${index}`] = product?.dyeing_amount || 0;
      acc[`dyeing_rate__${index}`] = product?.dyeing_rate || 0;
      acc[`dyeing_date__${index}`] = product?.dyeing_date || "";
      return acc;
    },
    {
      product__0: "",
      dyeing_amount__0: 0,
      dyeing_rate__0: 0,
      dyeing_date__0: "",
    }
  );

  const form = useForm({
    defaultValues,
  });

  const onSubmit = (values) => {
    // console.log(values);

    const data = products?.map((product, index) => {
      const copy = { ...product };
      delete copy.finished_products;

      return {
        ...copy,
        name: values[`name__${index}`],
        dyeing_amount: +values[`dyeing_amount__${index}`],
        dyeing_rate: +values[`dyeing_rate__${index}`],
        dyeing_date: values[`dyeing_date__${index}`],
      };
    });

    updateProducts(data)
      .then((res) => {
        if (res?.data?.success) {
          toast.success("Successfully updated.");
          setOpen(false);
        } else if (res?.error?.data?.error?.message)
          toast.error(res?.error?.data?.error?.message);
      })
      .catch((error) => {
        toast.error(error?.error?.message);
      });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
          {products?.map((product, index, all) => (
            <div
              key={product?.id}
              className={` pb-4  space-y-4 ${
                all.length - 1 !== index ? "border-b" : ""
              }  ${index === 0 ? "" : "py-4"}`}
            >
              <FormField
                control={form.control}
                name={`name__${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                        placeholder="Enter product name"
                        {...field}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dyeing_amount__${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dyeing Amount</FormLabel>
                    <FormControl>
                      <Input
                        className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Enter dyeing amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dyeing_rate__${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dyeing Rate</FormLabel>
                    <FormControl>
                      <Input
                        className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Enter dyeing rate"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dyeing_date__${index}`}
                type="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dyeing Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button className="bg-transparent border hover:bg-black/5 text-black">
                            {field?.value ? (
                              format(field?.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button type="submit"> {"Submit"} </Button>
        </form>
      </Form>
    </>
  );
}
