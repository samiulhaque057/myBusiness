"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetAllGraysQuery } from "@/features/gray/grayApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useAddProductMutation,
  useUpdateProductByIdMutation,
} from "@/features/products/productApi";
import { useRef } from "react";
import { useGetAllDyeingsQuery } from "@/features/dyeing/dyeingApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Calendar } from "../../../../components/ui/calendar";
import { format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import SubmitLoader from "@/app/(main)/components/SubmitLoader";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be string",
    })
    .min(2, "Product name must be at least 2 character"),
  grayName: z
    .string({
      required_error: "Gray name is required.",
      invalid_type_error: "Gray name must be string",
    })
    .min(1, "Gray name is required!"),
  grayId: z.coerce.number({
    required_error: "Gray id is required.",
    invalid_type_error: "Gray id must be number",
  }),
  gray_amount: z.coerce
    .number({
      required_error: "Gray amount is required.",
      invalid_type_error: "Gray amount must be number",
    })
    .min(1, "Gray amount must be at least 1 character"),
  gray_rate: z.coerce
    .number({
      required_error: "Gray rate is required.",
      invalid_type_error: "Gray rate must be number",
    })
    .min(1, "Gray amount must be at least 1 character"),
  gray_date: z.coerce
    .date({
      invalid_type_error: "Gray date must be date",
    })
    .optional(),
  dyeing_rate: z.coerce
    .number({
      invalid_type_error: "Dyeing rate must be number",
    })
    .optional(),
  dyeing_amount: z.coerce
    .number({
      invalid_type_error: "Dyeing amount must be number",
    })
    .optional(),
  dyeing_date: z.date().optional(),
  dyeing_name: z
    .string({
      required_error: "Dyeing name is required.",
      invalid_type_error: "Dyeing name must be string",
    })
    .min(1, "Dyeing name is required!"),
  dyeingId: z.coerce.number({
    invalid_type_error: "Dyeing id must be number",
  }),

  // delivery
  delivery_status: z
    .enum(["IN_MILL", "IN_HOUSE", "RUNNING"])
    .optional()
    .default("RUNNING"),
});

export default function ProductForm({ type = "add", formData = {}, setOpen }) {
  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductByIdMutation();

  const [addProduct, { isLoading }] = useAddProductMutation();

  const { data: { data: grays = [] } = {} } = useGetAllGraysQuery();
  const { data: { data: dyeings = [] } = {} } = useGetAllDyeingsQuery();

  const defaultValues = {
    name: type === "update" ? formData?.name : "",
    grayName: type === "update" ? formData?.gray?.name : "",
    grayId: type === "update" ? formData?.gray?.id : "",
    delivery_status: type === "update" ? formData?.delivery_status : "RUNNING",
    gray_amount: type === "update" ? formData?.gray_amount : 0,
    gray_rate: type === "update" ? formData?.gray_rate : 0,
    dyeing_name: type === "update" ? formData?.dyeing?.name : "",
    dyeing_amount: type === "update" ? formData?.dyeing_amount || 0 : 0,
    dyeingId: type === "update" ? formData?.dyeing?.id || "" : "",
    dyeing_rate: type === "update" ? formData?.dyeing_rate || 0 : 0,
    gray_date: type === "update" ? formData?.gray_date : new Date(),
  };

  if (type === "update") {
    defaultValues.gray_date = new Date(formData?.gray_date);
  }

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = async (values) => {
    const { dyeing_name } = values;

    // format change gray date
    if (values.gray_date) {
      values.gray_date = formatISO(values.gray_date);
    }

    // for update form
    if (type === "update") {
      delete values.grayName;

      if (dyeing_name) {
        delete values.dyeing_name;
      } else {
        delete values.dyeingId;
        delete values.dyeing_name;
        delete values.dyeing_amount;
        delete values.dyeing_rate;
      }

      const res = await updateProduct({
        id: formData.id,
        data: values,
      });
      if (res.data?.success) {
        setOpen && setOpen();
        toast.success(res.data?.message);
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
    // for edit form
    else if (type === "add") {
      delete values.grayName;

      if (dyeing_name) {
        delete values.dyeing_name;
      } else {
        if (!values.dyeing_name) return toast.error("Dyeing name is required!");
        else if (!values.dyeing_amount)
          return toast.error("Dyeing amount is required!");
        delete values.dyeing_name;
      }
      const res = await addProduct(values);
      if (res.data?.success) {
        setOpen(false);
        form.reset();
        toast.success("Successfully product added.");
      } else if (!res?.error?.data?.success) {
        toast.error(res?.error?.data?.error?.message);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    placeholder="Enter product name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gray Name</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        const grayId = value.split("___")[1];
                        form.setValue("grayId", +grayId);
                        field.onChange(value.split("___")[0]);
                      }
                    }}
                    defaultValue={
                      type === "update"
                        ? formData?.gray?.name
                          ? formData?.gray?.name + "___" + formData?.gray?.id
                          : ""
                        : ""
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select Gray Name"
                        aria-label="Rejoa"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {grays?.map((gray, index) => (
                        <SelectItem
                          value={gray.name + "___" + gray.id}
                          key={index}
                        >
                          {gray.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gray_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gray Amount </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    min={0}
                    step="0.01"
                    placeholder="Enter gray amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gray_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gray Rate </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    step="0.01"
                    placeholder="Enter gray rate"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gray_date"
            type="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Gray Date</FormLabel>
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
                      selected={field?.value}
                      onSelect={field?.onChange}
                      defaultValue={new Date()}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dyeing_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dyeing Name</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        const dyeingId = value.split("___")[1];
                        form.setValue("dyeingId", +dyeingId);
                        field.onChange(value.split("___")[0]);
                      }
                    }}
                    defaultValue={
                      type === "update"
                        ? formData?.dyeing?.name
                          ? formData?.dyeing?.name +
                            "___" +
                            formData?.dyeing?.id
                          : ""
                        : ""
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Dyeing Name" />
                    </SelectTrigger>
                    <SelectContent {...field}>
                      {dyeings?.map((dyeing, index) => (
                        <SelectItem
                          value={dyeing?.name + "___" + dyeing.id}
                          key={index}
                        >
                          {dyeing.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="dyeing_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dyeing Amount </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
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
            name="dyeing_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dyeing Rate </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                    step="0.01"
                    placeholder="Enter dyeing rate"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {type === "update" ? (
            <Button type="submit">
              <SubmitLoader label={"Update"} loading={isUpdateLoading} />
            </Button>
          ) : (
            <Button type="submit">
              <SubmitLoader label={"Submit"} loading={isLoading} />
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
