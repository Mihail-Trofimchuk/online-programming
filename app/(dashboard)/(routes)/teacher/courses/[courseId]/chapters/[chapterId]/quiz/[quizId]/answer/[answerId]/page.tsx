import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { AnswerTitleForm } from "./_components/answer-title-form";

import { AnswerActions } from "./_components/answer-actions";
import { CorrectAnswerForm } from './_components/correct-answer';

const AnswerIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId:string; quizId: string; answerId: string; }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  console.log(params.quizId);

  const answer = await db.answerOption.findUnique({
    where: {
      id: params.answerId,
      testId: params.quizId
    },
  });

  if (!answer) {
    return redirect("/")
  }

  const requiredFields = [
    answer.option,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}/quiz/${params.quizId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to test setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Answer Creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <AnswerActions
                disabled={!isComplete}
                courseId={params.courseId}
                testId={params.quizId}
                chapterId={params.chapterId}
				        answerId={params.answerId}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your answer
                </h2>
              </div>
              <AnswerTitleForm
                initialData={answer}
                courseId={params.courseId}
                chapterId={params.chapterId}
                testId={params.quizId}
				        answerId={params.answerId}
              />
            </div>
			<div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <CorrectAnswerForm
                initialData={answer}
                courseId={params.courseId}
                chapterId={params.chapterId}
                quizId={params.quizId}
				answerId={params.answerId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
   );
}
 
export default AnswerIdPage;