import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetAllDyeingsQuery } from "@/features/dyeing/dyeingApi";
import CreatableSelect from "react-select/creatable";

export default function ProductField({ index, removeField, form, showBorder }) {
  const { data: dyeings } = useGetAllDyeingsQuery();

  const dyeingNames = dyeings?.data.map((dt) => {
    return {
      value: dt.name,
      label: dt?.name,
      id: dt.id,
    };
  });
  return (
    <>
      <div className={`space-y-4 py-3  ${showBorder ? "border-b" : " "}`}>
        <FormField
          control={form.control}
          name={`product_${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                <span>Gray-{index}</span>
                {removeField && (
                  <span
                    onClick={removeField}
                    className="p-2 bg-red-100 rounded-md cursor-pointer"
                  >
                    X
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
                  placeholder="Enter gray name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name={`amount_${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount-{index} </FormLabel>
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
            name={`rate_${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate-{index} </FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dyeing for gray-{index}</FormLabel>
              <Select
                onValueChange={(date) => {
                  const [value, id] = date.split("___");

                  form.setValue(`dyeing_name_${index}`, value);
                  form.setValue(`dyeing_id_${index}`, +id);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Dyeing" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dyeingNames?.map((dyeing) => (
                    <SelectItem
                      value={dyeing.value + "___" + dyeing?.id}
                      key={dyeing.id}
                    >
                      {dyeing.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
