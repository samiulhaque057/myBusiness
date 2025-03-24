import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useGetAllGraysQuery } from "@/features/gray/grayApi";
import { format, formatISO } from "date-fns";
import { useForm } from "react-hook-form";
import { useGetAllDyeingsQuery } from "@/features/dyeing/dyeingApi";
import { Label } from "@/components/ui/label";

export default function BuyProduct({ type = "edit", formData }) {
  const { data: grays, isLoading } = useGetAllGraysQuery();
  const { data: dyeings } = useGetAllDyeingsQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {};

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div>
          <Label htmlFor="terms">Product Name</Label>
          <Input
            defaultValue={"test"}
            {...register("name", {
              required: "Product name is required",
              minLength: {
                value: 2,
                message: "Product name must be at least 2 character",
              },
            })}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
          />
          {errors.name && (
            <p role="alert" className="text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <Button type="submit"> {isLoading ? "Loading" : "Submit"} </Button>
      </form>
    </>
  );
}
