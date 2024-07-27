import { z } from "zod";

const loginFormSchema = z.object({
  username: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(3, "اسم المستخدم يجب أن يتكون من 3 حروف على الاقل")
        .max(20, "اسم المستخدم يجب ألا يزيد عن 20 حرفا")
        .refine(
          (val) => val.match(/[a-zA-Z0-9]/),
          "اسم المستخدم لا يمكن ان يحتوي على حروف غير انكليزية",
        )
        .refine(
          (val) => !val.includes(" "),
          "اسم المستخدم لا يمكن ان يحتوي على مسافات",
        ),
    ),
  password: z
    .string()
    .min(8, "كلمة المرور يجب ان تتالف من 8 حروف على الاقل")
    .max(20, "كلمة المرور يجب ألا تزيد عن 20 حرفا"),
});

export default loginFormSchema;
