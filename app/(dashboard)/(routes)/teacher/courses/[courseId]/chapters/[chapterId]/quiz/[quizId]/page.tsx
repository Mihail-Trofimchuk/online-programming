import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TestTitleForm } from "./_components/quiz-title-form";
import { AnswerForm } from "./_components/answer-form" 


import { TestActions } from "./_components/test-actions";

const TestIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string; quizId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  console.log(params.quizId);

  const test = await db.test.findUnique({
    where: {
      id: params.quizId,
      chapterId: params.chapterId
    },
    include: {
      answerOptions: true,
    },
  });

  if (!test) {
    return redirect("/")
  }

  const requiredFields = [
    test.question,
    test.answerOptions.some(answer => answer.option),

  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!test.isPublished && (
        <Banner
          variant="warning"
          label="This test is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Test Creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <TestActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                testId={params.quizId}
                isPublished={test.isPublished}
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
                  Customize your test
                </h2>
              </div>
              <TestTitleForm
                initialData={test}
                courseId={params.courseId}
                chapterId={params.chapterId}
                testId={params.quizId}
              />
               <AnswerForm
                initialData={test}
                courseId={params.courseId}
                chapterId={params.chapterId}
                quizId={test.id}
              />
            </div>
            {/* <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div> */}
          </div>
        </div>
      </div>
    </>
   );
}
 
export default TestIdPage;