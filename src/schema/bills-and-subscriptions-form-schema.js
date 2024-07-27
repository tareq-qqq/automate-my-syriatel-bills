import { z } from "zod";

// look into this asap
// https://zod.dev/?id=relationship-to-transforms
export const textAreaSchema = z.object({
  city: z.string({ required_error: "الرجاء قم باختيار المحافظة" }),
  billingAndSubscriptionNumbers: z
    .string({
      required_error: "الرجاء ادخال الارقام",
    })
    .refine(
      (val) =>
        val
          .split(/\n|\r\n|\r/)
          .every(
            (line) => line.trim().match(/^\d+\s+\d+$/) || line.trim() === "",
          ),
      "الرجاء التاكد من الصيغة",
    )
    .transform((val, ctx) => {
      const array = val
        .split(/\n|\r\n|\r/)
        .map((line) => line.trim())
        .filter((line) => line != "")
        .map((line) => {
          const [billingNo, subscriptionNo] = line.split(/\s+/);
          return { billingNo, subscriptionNo };
        });

      if (array.length === 0) {
        ctx.addIssue({
          message: "الرجاء ادخال الارقام",
        });
      }

      return array;
    }),
});
