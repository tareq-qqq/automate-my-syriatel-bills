import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function ErrorTable({ errorBills }) {
  const navigate = useNavigate();
  return (
    <div dir="rtl">
      <h2 className="mb-2 text-lg font-medium">
        حصل خطأ اثناء معالجة الفواتير التالية
      </h2>
      <div className="className mx-auto w-full max-w-xl space-y-4 py-4">
        <Table className="rounded-md border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-destructive">رقم الاشتراك</TableHead>
              <TableHead className="text-destructive">رقم الفوترة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errorBills.map((bill) => (
              <TableRow className="[&_*]:text-center" key={bill.id}>
                <TableCell>{bill.subscriptionNo}</TableCell>
                <TableCell>{bill.billingNo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          className="w-full"
          onClick={() => navigate("/", { state: { errorBills, error: true } })}
        >
          إجراء بحث على هذه الفواتير
        </Button>
      </div>
    </div>
  );
}
export default ErrorTable;
