import FormInput from "@/components/react-hook-form/FormInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { tryCatch } from "@/hooks/use-tryCatch";
import { chapterSchema, chapterSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createNewChapterAction } from "../actions";
import { toast } from "sonner";

const NewChapterModal = ({ courseId }: { courseId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onOpenChangeHandler = (open: boolean) => {
    setIsOpen(open);
  };

  const form = useForm<chapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });

  const onSubmit = (values: chapterSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createNewChapterAction(values));

      if (error) {
        toast.error("An unexpected error accurred. Please try again.");
        return;
      }

      if (result.statusText === "error") {
        toast.error(result.error);
      } else if (result.statusText === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" /> New Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>What do you want to name your new chapter</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput form={form} name="name" placeholder="Chapter Name" label="Name" />

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="size-4" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChapterModal;
