"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/use-tryCatch";
import { useTransition } from "react";
import { enrollCourseAction } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EnrollmentButton = ({ courseId }: { courseId: string }) => {
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollCourseAction(courseId));

      if (error) {
        toast.error(`To enroll in the course, you have to login first.`);
        return;
      }

      if (result.statusText === "error") {
        toast.error(result.error);
      } else if (result.statusText === "success") {
        toast.success(result.message);
      }
    });
  }

  return (
    <Button onClick={onSubmit} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Loading...
        </>
      ) : (
        "Enroll Now!"
      )}
    </Button>
  );
};

export default EnrollmentButton;
