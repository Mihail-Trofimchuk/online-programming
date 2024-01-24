import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedTest = await db.test.update({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedTestInCourse = await db.test.findMany({
      where: {
        chapterId: params.chapterId,
        isPublished: true,
      }
    });

    if (!publishedTestInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(unpublishedTest);
  } catch (error) {
    console.log("[TEST_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}