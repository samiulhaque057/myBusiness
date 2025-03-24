import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoTrashOutline } from "react-icons/io5";
import {
  useDeleteGrayPaymentByIdMutation,
  useUpdateGrayPaymentByIdMutation,
} from "@/features/gray/grayApi";
import Swal from "sweetalert2";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";
import AddPayment from "./AddPayment";
import { numberToFixed } from "@/app/(main)/components/helper";
import { TbCoinTakaFilled } from "react-icons/tb";
import UpdatePaymentModal from "./UpdatePaymentModal";

export default function PaymentTable({ data = [], isLoading = false, gray }) {
  const [open, setOpen] = React.useState();
  const [updatePayemnt, { isUpdateLoading }] =
    useUpdateGrayPaymentByIdMutation();
  const [deletePayment] = useDeleteGrayPaymentByIdMutation();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // handle delete payment
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete gray payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result?.isConfirmed) {
      const res = await deletePayment(id);
      if (res?.data?.success) {
        Swal.fire("Deleted!", "Gray payment  has been deleted.", "success");
      } else {
        Swal.fire({
          title: "Failed",
          text: res?.error?.data?.error?.message,
          icon: "error",
        });
      }
    }
  };

  const columns = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => (
        <div className="capitalize">{+row.getValue("index") + 1}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="capitalize text-[12px]">{row.getValue("date")}</div>
      ),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => (
        <div className="capitalize flex items-center gap-1">
          <TbCoinTakaFilled className="text-base mt-[2px]" />
          {numberToFixed(+row.getValue("payment"))}
        </div>
      ),
    },
    {
      accessorKey: "Action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex gap-2">
            <UpdatePaymentModal
              row={row}
              isUpdateLoading={isUpdateLoading}
              updatePayemnt={updatePayemnt}
            />
            <Button
              className=" text-lg py-2 h-8 px-2 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-red-400  border"
              onClick={() => handleDelete(row?.original?.id)}
              disabled={true}
            >
              <IoTrashOutline />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  return (
    <div className="w-full ">
      <div className="flex items-center py-4 gap-x-8 gap-y-2  flex-wrap justify-between w-full">
        <Input
          placeholder="Filter by date..."
          value={table.getColumn("date")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("date")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px] min-w-[150px]  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
        />

        <AddPayment data={{ ...gray }} />
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="rounded-md border ">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-16 text-red-500 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4 flex-wrap">
            <div className="flex-1 text-sm text-muted-foreground text-nowrap">
              showing {table.getRowModel().rows?.length} of {data?.length}{" "}
              enteries
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
