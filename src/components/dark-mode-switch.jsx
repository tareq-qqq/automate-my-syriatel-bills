import { Moon } from "lucide-react";
import { Sun } from "lucide-react";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { useState } from "react";
import { cn } from "/src/lib/utils.js";

function DarkModeSwitch({ className, ...props }) {
  const [checked, setChecked] = useState(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  function handleChange(checked) {
    setChecked(checked);

    if (checked) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
      document.head
        .querySelector("[name='theme-color']")
        .setAttribute("content", "black");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      document.head
        .querySelector("[name='theme-color']")
        .setAttribute("content", "white");
    }
  }

  return (
    <SwitchPrimitives.Root
      onCheckedChange={handleChange}
      checked={checked}
      className={cn(
        "focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-input data-[state=unchecked]:bg-input peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-gray-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600",
        className,
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb asChild>
        <span
          className={cn(
            "bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
            "grid place-content-center duration-200",
          )}
        >
          {checked ? (
            <Moon strokeWidth={1} className="h-4 w-4" />
          ) : (
            <Sun strokeWidth={1} className="h-4 w-4" />
          )}
        </span>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>

    // <Switch className=""  />
  );
}
export default DarkModeSwitch;
