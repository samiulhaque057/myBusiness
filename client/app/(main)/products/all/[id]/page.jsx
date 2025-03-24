"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProductByIdQuery } from "@/features/products/productApi";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";

import ProductInformation from "../../../components/products/card/ProductInformation";
import GrayInfo from "../../../components/products/card/GrayInfo";
import { format, parse } from "date-fns";
import DyeingInfo from "../../../components/products/card/DyeingInfo";
import ProductInfo from "../../../components/products/card/ProductInfo";
import AskInfo from "../../../components/products/card/AskInfo";
import FinishedProductInfo from "../../../components/products/card/FinishedProductInfo";
import { numberToFixed, productStatus } from "@/app/(main)/components/helper";

export default function SingleProduct({ params }) {
  const { id } = params;

  const { data: { data: productData = {} } = {}, isLoading } =
    useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <Skeleton className="h-[30px] w-[300px] rounded-md" />
        <div className="mx-auto pt-6 space-y-2">
          <Skeleton className="h-[20px] w-full rounded-md" />
          <Skeleton className="h-[20px] w-full rounded-md" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3  lg:py-4">
      <Breadcrumb className="">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="transition-colors hover:text-slate-950" href={"/"}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              className="transition-colors hover:text-slate-950"
              href={"/products/all"}
            >
              All Product
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">
              {productData?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ElahiVorsa />

      {/* product information  */}
      <ProductInformation
        name={productData?.name}
        id={productData?.id}
        status={productStatus(productData)}
      />

      <div className="py-10 grid lg:grid-cols-2 gap-6 ">
        {/* gray info  */}
        <GrayInfo
          name={productData?.gray?.name}
          amount={numberToFixed(+productData?.gray_amount)}
          rate={numberToFixed(+productData?.gray_rate)}
          id={productData?.gray?.id}
          productId={productData?.id}
          date={
            productData?.gray_date &&
            format(
              parse(productData?.gray_date, "yyyy-MM-dd", new Date()),
              "d MMMM yyyy"
            )
          }
        />
        {/* dyeing info  */}
        <DyeingInfo
          name={productData?.dyeing?.name}
          amount={numberToFixed(+productData?.dyeing_amount)}
          id={productData?.dyeing?.id}
          rate={numberToFixed(+productData?.dyeing_rate)}
          productId={productData?.id}
          date={
            productData?.dyeing_date &&
            format(
              parse(productData?.dyeing_date, "yyyy-MM-dd", new Date()),
              "d MMMM yyyy"
            )
          }
        />

        {/* product info  */}
        <ProductInfo product={productData} />

        {/* ask info  */}
        <AskInfo product={productData} />

        {/* finished product info  */}
        <div className="col-span-2">
          <FinishedProductInfo product={productData} />
        </div>
      </div>
    </div>
  );
}
