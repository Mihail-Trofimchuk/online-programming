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

    const test = await db.test.findUnique({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      }
    });

    // const muxData = await db.muxData.findUnique({
    //   where: {
    //     chapterId: params.chapterId,
    //   }
    // });

    if (!test) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedTest = await db.test.update({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedTest);
  } catch (error) {
    console.log("[TEST_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}