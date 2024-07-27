import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { textAreaSchema } from "../schema/bills-and-subscriptions-form-schema";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    defaultValues: {
      billingAndSubscriptionNumbers: getDefaultValue(),
      city: "01",
    },
    mode: "onChange",
    resolver: zodResolver(textAreaSchema),
    delayError: 300,
  });

  // In case of redirection from the the bills-table component with error bills
  // populate the textarea with the error bills billingNos and subscriptionNos
  function getDefaultValue() {
    const errorBills = location.state?.errorBills;
    if (errorBills && errorBills.length > 0) {
      const text = errorBills
        .map(
          ({ billingNo, subscriptionNo }) => `${billingNo} ${subscriptionNo}`,
        )
        .join("\n");
      console.log(text);
      return text;
    }
    return "";
  }
  async function onSubmit({ billingAndSubscriptionNumbers, city }) {
    // The user must be logged in to access the root page
    // because if they're not logged in they won't have this cookie
    console.log(billingAndSubscriptionNumbers);
    console.log(city);
    const userId = Cookies.get("userId");

    try {
      const res = await fetch("http://localhost:3000/bills", {
        method: "post",
        body: JSON.stringify({ billingAndSubscriptionNumbers, city }),
        headers: {
          "content-type": "application/json",
          userId: userId,
        },
      });

      if (res.status === 401) {
        // display something like session ended
        // maybe display a modal somehow and when that's clicked navigate to the login now just the login will do
        console.log("couldn't find the uuid you provided on the server");
        Cookies.remove("userId");
        alert("انتهت مدة الجلسة");
        navigate("/login");
      } else if (res.ok) {
        const json = await res.json();
        console.log(json);
        navigate("/bills", {
          state: {
            bills: json,
          },
        });
      } else if (res.status === 500) {
        const json = await res.json();
        form.setError("root.serverError", {
          message: json.message,
        });
      }
      // put a error server is down
    } catch (error) {
      form.setError("root.serverError", {
        message:
          "حدث خطأ ما، غير قادر على الوصول الى السيرفر اعد المحاولة لاحقا",
      });
    }
  }

  return (
    <div
      className=" mx-auto grid w-full max-w-xl content-center items-center"
      dir="rtl"
    >
      <h1 className="mb-8 font-bold">أدخل أرقام الفوترة والاشتراك</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">المحافظة</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    dir="rtl"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem selected value="01">
                        دمشق
                      </SelectItem>
                      <SelectItem value="02">ريف دمشق</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingAndSubscriptionNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    أرقام الفوترة والاشتراك
                  </FormLabel>
                  <FormControl dir="ltr">
                    <Textarea
                      placeholder={`5352332 320356\n5352411 566696\n5352333 139656\n5532081 925193\n5555811 946508\n5354017 745143\n5544900 932866\n5651711 1018346\n5353150 721039`}
                      {...field}
                      className="h-60"
                      onInput={() => form.clearErrors("root")}
                    />
                  </FormControl>

                  <FormDescription>
                    {form.formState.isSubmitting &&
                      "جارٍ تنفيذ طلبك قد تستغرق العملية بعضا من الوقت"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? (
                <LoaderCircle strokeWidth={2} className="animate-spin" />
              ) : (
                "إدخال"
              )}
            </Button>

            <FormMessage>
              {form.formState.errors.root?.serverError &&
                form.formState.errors.root?.serverError.message}
            </FormMessage>
          </div>
        </form>
      </Form>
    </div>
  );
}
export default Root;
