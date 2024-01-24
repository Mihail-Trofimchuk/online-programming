"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface TestActionsProps {
  disabled: boolean;
  courseId: string;
  testId: string;
  chapterId: string,
  answerId: string;
};

export const AnswerActions = ({
  disabled,
  courseId,
  testId,
  chapterId,
  answerId
}: TestActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

//   const onClick = async () => {
//     try {
//       setIsLoading(true);

//       if (isPublished) {
//         await axios.patch(`/api/courses/${courseId}/quiz/${testId}/unpublish`);
//         toast.success("Test unpublished");
//       } else {
//         await axios.patch(`/api/courses/${courseId}/quiz/${testId}/publish`);
//         toast.success("Test published");
//       }

//       router.refresh();
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   }
  
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quiz/${testId}/answer/${answerId}`);

      toast.success("Answer deleted");
      router.refresh();
      router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/quiz/${testId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}