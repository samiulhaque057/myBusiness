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
import ProductTable from "@/app/(main)/components/products/ProductTable";

import { useGetAllProductsQuery } from "@/features/products/productApi";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";
import PageTitle from "@/components/PageTitle";
import {
  numberToFixed,
  productShortage,
  productStatus,
} from "../../components/helper";

export default function AllProduct() {
  const { data: { data: products = [] } = {}, isLoading } =
    useGetAllProductsQuery();

  const processData = products.map((product) => {
    // finished product
    const finishedProduct = product?.finished_products?.reduce(
      (acc, product) => {
        acc += product?.amount;
        return acc;
      },
      0
    );

    const gRate = product?.gray_rate;
    const dRate = product?.dyeing_rate;

    // sortage furmula
    const shortage = productShortage(product);

    const unit_cost =
      gRate && dRate && numberToFixed(+gRate + +dRate + +shortage);

    return {
      unit_cost,
      dyeing_name: product?.dyeing?.name,
      gray_name: product?.gray?.name,
      shortage,
      status: productStatus(product),
      ...product,
    };
  });

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
            <BreadcrumbLink className="text-black">All Products</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ElahiVorsa />

      <PageTitle title={"All Product Data"} />

      <ProductTable isLoading={isLoading} data={processData || []} />
    </div>
  );
}
