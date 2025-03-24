"use client";
import PageTitle from "@/components/PageTitle";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetAllUsersQuery } from "@/features/auth/authApi";
import Link from "next/link";
import ModeratorTable from "./ModeratorTable";

export default function Moderators() {
  const { data: { data: users = [] } = {}, isLoading } = useGetAllUsersQuery();

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3  lg:py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link className="transition-colors hover:text-slate-950" href={"/"}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">Moderators</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* page title  */}
      <PageTitle title={"All  Users Data"} />

      {isLoading ? <TableSkeleton /> : <ModeratorTable data={users || []} />}
    </div>
  );
}
