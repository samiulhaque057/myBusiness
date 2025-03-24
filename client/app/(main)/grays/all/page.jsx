"use client";
import GrayTable from "@/app/(main)/components/gray/GrayTable";
import { useGetAllGraysQuery } from "@/features/gray/grayApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import ElahiVorsa from "@/app/(main)/components/ElahiVorsa";
import PageTitle from "@/components/PageTitle";
import {
  totalSingeGrayAmount,
  totalSingleGrayCost,
  totalSingleGrayDiscount,
  totalSingleGrayPaid,
} from "../../components/gray/gray.helper";

export default function AllGrays() {
  const { data: { data: grays = [] } = {}, isLoading } = useGetAllGraysQuery();

  const graysData = grays?.map((gray) => {
    const totalAmount = totalSingeGrayAmount(gray);
    const totalCost = totalSingleGrayCost(gray);
    const totalPaid = totalSingleGrayPaid(gray);
    const totalDiscount = totalSingleGrayDiscount(gray);
    const totalDue =
      (totalCost && totalCost - (totalPaid + totalDiscount)) || 0;

    return {
      id: gray?.id,
      name: gray?.name,
      address: gray?.address,
      phone: gray?.phone,
      products: gray?.products,
      total_amount: totalAmount || 0,
      due: totalDue,
    };
  });

  return (
    <div className=" px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3  lg:py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="transition-colors hover:text-slate-950" href={"/"}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">
              Gray Companies
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ElahiVorsa />

      <PageTitle title={"All Gray Company Data"} />

      <GrayTable data={graysData || []} isLoading={isLoading} />
    </div>
  );
}
