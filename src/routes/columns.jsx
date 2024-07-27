import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
const helper = createColumnHelper();

export const COLUMNS = [
  helper.accessor("subscriptionNo", {
    header: <span className="text-destructive">رقم الاشتراك</span>,
    cell: (props) => props.getValue(),
  }),
  helper.accessor("billingNo", {
    header: "رقم الفوترة",
    cell: (props) => props.getValue(),
    enableColumnFilter: false,
  }),

  helper.accessor("name", {
    header: "الاسم",
    cell: (props) => props.getValue(),
    filterFn: "includesString",
  }),
  helper.accessor("period", {
    header: "الدورة",
    cell: (props) => props.getValue(),
    enableColumnFilter: false,
  }),
  helper.accessor("year", {
    header: "العام",
    cell: (props) => props.getValue(),
    enableColumnFilter: false,
  }),
  helper.accessor("amount", {
    header: ({ column }) => {
      return (
        <div className="flex w-full justify-center">
          <Button
            className="flex gap-2"
            variant="ghost"
            onClick={() => column.toggleSorting()}
          >
            <span>الفاتورة</span>
            <ArrowUpDown
              className={`h-4 w-4 ${column.getIsSorted() && "text-destructive"}`}
            />
          </Button>
        </div>
      );
    },
    cell: (props) =>
      Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "SYP",
      }).format(props.getValue()),
    enableColumnFilter: false,
  }),
];

export default COLUMNS;
