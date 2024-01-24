import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { CorrectAnswerForm } from './_components/correct-answer';

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

//   console.log(params.quizId);

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    return redirect("/")
  }

//   const requiredFields = [
//     answer.option,
//   ];

//   const totalFields = requiredFields.length;
//   const completedFields = requiredFields.filter(Boolean).length;

//   const completionText = `(${completedFields}/${totalFields})`;

//   const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/courses/`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to courses page
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Answer Creation
                </h1>
              
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
			<div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <CorrectAnswerForm
                initialData={course}
                courseId={params.courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
   );
}
 
export default CourseIdPage;