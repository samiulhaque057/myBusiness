import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useDeleteGrayByIdMutation } from "@/features/gray/grayApi";
import { GrAddCircle } from "react-icons/gr";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GrayForm from "@/app/(main)/components/gray/GrayForm";
import TableSkeleton from "@/app/(main)/components/skeleton/TableSkeleton";
import CheckForm from "./CheckForm";
import { format, parseISO } from "date-fns";
import {
  useCompleteCustomerCheckByIdMutation,
  useDeleteCustomerCheckByIdMutation,
} from "@/features/customers/customerApi";
import { toast } from "react-toastify";

export default function CheckCard({ data, isLoading }) {
  const [open, setOpen] = React.useState();
  const [deleteCheck, { error }] = useDeleteCustomerCheckByIdMutation();
  const [completeCheck] = useCompleteCustomerCheckByIdMutation();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This check will be delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result?.isConfirmed) {
      const res = await deleteCheck(id);
      if (res?.data?.success) {
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      } else {
        Swal.fire({
          title: "Failed",
          text: error?.data?.message,
          icon: "error",
        });
      }
    }
  };

  // handle check done

  const handleCheckDone = async (data) => {
    const values = {
      id: data.id,
      customerId: data.customerId,
      amount: data.amount,
    };

    const res = await completeCheck({
      id: values.id,
      data: values,
    });
    if (res.data?.success) {
      toast.success(res.data?.message);
    } else if (!res?.error?.data?.success) {
      toast.error(res?.error?.data?.error?.message);
    }
  };

  const columns = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("index")}</div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="capitalize">
          <Link href={`/customers/all/${row?.original?.customer?.id}`}>
            {row.getValue("customer_name")}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("amount")}</div>
      ),
    },
    {
      accessorKey: "bank",
      header: "Bank",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("bank")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="capitalize">
          {format(parseISO(row.getValue("date")), "d MMMM  yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">
          <Button
            className=" text-sm h-8 bg-white text-black hover:text-black  border  hover:bg-black/5"
            disabled={row?.original?.status}
            onClick={() => {
              handleCheckDone(row.original);
            }}
          >
            Done
          </Button>
        </div>
      ),
    },

    {
      accessorKey: "Action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex gap-2">
            <Dialog>
              <DialogTrigger className="py-2 h-8 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-blue-400  border">
                <FaRegEdit />
              </DialogTrigger>
              <DialogContent className="overflow-scroll ">
                <DialogHeader>
                  <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                    Update Check Data
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <CheckForm type="update" formData={row?.original} />
              </DialogContent>
            </Dialog>
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
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <Input
          placeholder="Filter by name..."
          value={table.getColumn("customer_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("customer_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="py-2 h-10 rounded-md flex items-center px-3 bg-transparent active:scale-95 transition-all duration-100 text-black hover:bg-black/5 hover:text-slate-600  border">
            <GrAddCircle /> <span className="text-[12px] pl-2">Check</span>
          </DialogTrigger>
          <DialogContent className="overflow-scroll ">
            <DialogHeader>
              <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
                Add Check Data
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CheckForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id?.split("_").join(" ")}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="rounded-md border">
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
                        <TableCell key={cell.id}>
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
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
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
