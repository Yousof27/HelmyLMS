import CustomFormField from "./CustomFormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormControl } from "../ui/form";

interface FormSelectProps {
  form: any;
  name: string;
  selectContent: string[];
  placeholder: string;
  label?: string;
  FormItemCSS?: string;
  selectTriggerCSS?: string;
}

const FormSelect = ({ form, name, label, FormItemCSS, selectContent, selectTriggerCSS, placeholder }: FormSelectProps) => {
  return (
    <CustomFormField form={form} name={name} label={label} FormItemCSS={FormItemCSS}>
      {(field) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger id={field.name} className={selectTriggerCSS}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {selectContent?.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </CustomFormField>
  );
};

export default FormSelect;
