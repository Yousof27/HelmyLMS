import { ReactNode } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CustomFormFieldProps {
  form: any;
  name: string;
  label?: string;
  FormItemCSS?: string;
  children: ReactNode | ((field: any) => ReactNode);
}

export default function CustomFormField({ form, name, label, FormItemCSS, children }: CustomFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={FormItemCSS}>
          {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
          <FormControl>{typeof children === "function" ? children(field) : children}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
