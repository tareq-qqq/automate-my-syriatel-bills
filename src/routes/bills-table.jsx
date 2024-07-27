import { useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import COLUMNS from "./columns.jsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Ellipsis,
  ChevronLast,
  ChevronFirst,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import ErrorTable from "../components/error-table.jsx";
import { Pagination, PaginationItemType } from "@nextui-org/pagination";

function BillsTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });

  // const data = useMemo(
  //   () => location.state.bills.filter((bill) => !bill.error && bill.name),
  //   [location.state],
  // );

  const data = useMemo(
    () =>
      location.state.bills.map((bill) => {
        if (!bill.amount) {
          return { ...bill, amount: 0 };
        }
        return bill;
      }),
    [location.state],
  );

  const errorBills = useMemo(
    () => location.state?.bills.filter((bill) => bill.error),
    [location.state],
  );
  const errorSubscriptionNo = useMemo(
    () => errorBills.map((bill) => bill.subscriptionNo),
    [errorBills],
  );

  const columns = useMemo(() => COLUMNS, []);

  console.log(data);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    state: {
      // sorting,
      // columnFilters,
      pagination,
    },
  });

  const [filterBy, setFilterBy] = useState("subscriptionNo");
  const map = new Map([
    ["name", "الاسم"],
    ["subscriptionNo", "رقم الاشتراك"],
  ]);

  if (!location.state) {
    return <Navigate to="/" replace={true} />;
  }

  console.log(filterBy);
  console.log(table.getState());
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8" dir="rtl">
      <div>
        <h1 className="mb-2 text-lg font-medium">الفواتير غير المدفوعة</h1>
        <div className=" flex w-full flex-wrap items-end justify-between gap-4 px-8 py-4">
          <div className="space-y-2">
            <Label htmlFor="select">البحث حسب</Label>
            <Select
              dir="rtl"
              defaultValue={"subscriptionNo"}
              onValueChange={(value) => setFilterBy(value)}
            >
              <SelectTrigger id="select" className="w-[180px]">
                <SelectValue placeholder="البحث حسب" />
              </SelectTrigger>
              <SelectContent>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => {
                    return (
                      <SelectItem value={column.id} key={column.id}>
                        {map.get(column.id)}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div className="relative max-w-sm">
            <Input
              placeholder={`البحث حسب ${map.get(filterBy)}`}
              value={table.getColumn(filterBy).getFilterValue() || ""}
              onChange={(e) =>
                table.getColumn(filterBy).setFilterValue(e.target.value)
              }
              className="peer w-full pr-10"
            />
            <Search className="pointer-events-none absolute right-2 top-0 h-10 text-muted-foreground peer-focus-visible:text-primary" />
          </div>
        </div>
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
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) =>
                  row.getValue("amount") != 0 ? (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="text-center" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ) : (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      <TableCell className="text-center">
                        {row.getValue("subscriptionNo")}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.getValue("billingNo")}
                      </TableCell>
                      <TableCell
                        className="text-center"
                        colSpan={row.getVisibleCells().length - 2}
                      >
                        {errorSubscriptionNo.includes(
                          row.getValue("subscriptionNo"),
                        ) ? (
                          <span className="font-medium text-destructive">
                            حصل خطأ
                          </span>
                        ) : (
                          <span className="font-medium text-muted-foreground">
                            مدفوعة
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ),
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    لاتوجد نتائج
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className=" flex items-center justify-between space-x-2 py-4">
          <Pagination
            showControls
            radius="sm"
            dir={"ltr"}
            total={table.getPageCount()}
            onChange={(page) => table.setPageIndex(page - 1)}
            classNames={{
              cursor:
                "bg-primary min-w-0 w-9 h-9 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              wrapper: "gap-2",
            }}
            renderItem={({
              ref,
              key,
              value,
              onNext,
              onPrevious,
              setPage,
              isBefore,
              dotsJump,
              activePage,
            }) => {
              if (value === PaginationItemType.NEXT) {
                return (
                  <Button
                    disabled={!table.getCanNextPage()}
                    onClick={onNext}
                    variant="outline"
                    size="pagination"
                  >
                    <ChevronRight strokeWidth={1} />
                  </Button>
                );
              }

              if (value === PaginationItemType.PREV) {
                return (
                  <Button
                    disabled={!table.getCanPreviousPage()}
                    onClick={onPrevious}
                    size="pagination"
                    variant="outline"
                  >
                    <ChevronLeft strokeWidth={1} />
                  </Button>
                );
              }

              if (value === PaginationItemType.DOTS) {
                return (
                  <Button
                    onClick={() => {
                      if (isBefore) {
                        setPage(activePage - dotsJump);
                      } else {
                        setPage(activePage + dotsJump);
                      }
                    }}
                    hoveredChild={
                      isBefore ? (
                        <ChevronsLeft size={14} />
                      ) : (
                        <ChevronsRight size={14} />
                      )
                    }
                    size="pagination"
                    variant="ghost"
                  >
                    <Ellipsis size={14} />
                  </Button>
                );
              }

              // // cursor is the default item
              return (
                <Button
                  key={key}
                  ref={ref}
                  variant={"ghost"}
                  size="pagination"
                  onClick={() => setPage(value)}
                >
                  {value}
                </Button>
              );
            }}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1, { replace: true })}
          >
            العودة
          </Button>
        </div>
      </div>
      {errorBills.length > 0 && <ErrorTable errorBills={errorBills} />}
    </div>
  );
}
export default BillsTable;
