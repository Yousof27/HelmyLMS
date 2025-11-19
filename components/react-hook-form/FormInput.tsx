import { Input } from "../ui/input";
import CustomFormField from "./CustomFormField";

interface FormInputProps {
  form: any;
  name: string;
  type?: string;
  placeholder: string;
  label?: string;
  FormItemCSS?: string;
}

const FormInput = ({ form, name, label, placeholder, type, FormItemCSS }: FormInputProps) => {
  return (
    <CustomFormField form={form} name={name} label={label} FormItemCSS={FormItemCSS}>
      {(field) => (
        <Input
          id={field.name}
          type={type || "text"}
          placeholder={placeholder}
          {...field}
          onChange={
            type === "number"
              ? (e) => {
                  const value = e.target.value;
                  const num = value === "" ? 0 : parseFloat(value);
                  field.onChange(num);
                }
              : field.onChange
          }
        />
      )}
    </CustomFormField>
  );
};

export default FormInput;
