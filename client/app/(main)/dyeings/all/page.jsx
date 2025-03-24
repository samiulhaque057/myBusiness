"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import DyeingTable from "@/app/(main)/components/dyeings/dyeingTable";
import { useGetAllDyeingsQuery } from "@/features/dyeing/dyeingApi";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";
import PageTitle from "@/components/PageTitle";
import { totalSingeGrayAmount } from "../../components/gray/gray.helper";
import {
  totalSingleDyeingCost,
  totalSingleDyeingDiscount,
  totalSingleDyeingPaid,
} from "../../components/dyeings/dyeing.helper";
export default function AllDyeing() {
  const { data: { data: dyeings = [] } = {}, isLoading } =
    useGetAllDyeingsQuery();

  const processData = dyeings?.map((dyeing) => {
    const totalAmount = totalSingeGrayAmount(dyeing);
    const totalCost = totalSingleDyeingCost(dyeing);
    const totalPaid = totalSingleDyeingPaid(dyeing);
    const totalDiscount = totalSingleDyeingDiscount(dyeing);
    const totalDue =
      (totalCost && totalCost - (totalPaid + totalDiscount)) || 0;

    return {
      id: dyeing?.id,
      name: dyeing?.name,
      address: dyeing?.address,
      phone: dyeing?.phone,
      products: dyeing?.products,
      total_amount: totalAmount || 0,
      due: totalDue,
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
            <BreadcrumbLink className="text-black">
              Dyeing Companies
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ElahiVorsa />

      <PageTitle title={"All Dyeing Data"} />
      <DyeingTable isLoading={isLoading} data={processData || []} />
    </div>
  );
}
