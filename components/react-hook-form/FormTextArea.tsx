import { Textarea } from "../ui/textarea";
import CustomFormField from "./CustomFormField";

interface FormTextAreaProps {
  form: any;
  name: string;
  placeholder: string;
  label?: string;
  FormItemCSS?: string;
  textareaCSS?: string;
}

const FormTextArea = ({ form, name, label, placeholder, FormItemCSS, textareaCSS }: FormTextAreaProps) => {
  return (
    <CustomFormField form={form} name={name} label={label} FormItemCSS={FormItemCSS}>
      {(field) => <Textarea id={field.name} placeholder={placeholder} {...field} className={textareaCSS} />}
    </CustomFormField>
  );
};

export default FormTextArea;
