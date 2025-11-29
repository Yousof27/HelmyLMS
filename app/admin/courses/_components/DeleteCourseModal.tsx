"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { tryCatch } from "@/hooks/use-tryCatch";
import { toast } from "sonner";
import { deleteCourseAction } from "../actions";

interface DeleteCourseModalProps {
  courseId: string;
}

const DeleteCourseModal = (values: DeleteCourseModalProps) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourseAction(values));

      if (error) {
        toast.error("An unexpected error accurred. Please try again.");
        return;
      }

      if (result.statusText === "error") {
        toast.error(result.error);
      } else if (result.statusText === "success") {
        toast.success(result.message);
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-start">
          <Trash2 className="size-4 mr2 text-destructive" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are You Sure ?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete this course</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onSubmit} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCourseModal;
