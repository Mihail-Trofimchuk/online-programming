
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; quizId: string; answerId: string; } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const answer = await db.answerOption.findUnique({
      where: {
        id: params.answerId,
        testId: params.quizId,
      }
    });

    if (!answer) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedAnswer = await db.answerOption.delete({
      where: {
        id: params.answerId
      }
    });

    return NextResponse.json(deletedAnswer);
  } catch (error) {
    console.log("[ANSWER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; quizId: string; answerId: string; } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

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

    const answer = await db.answerOption.update({
      where: {
        id: params.answerId,
        testId: params.quizId,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.log("[ANSWER_TEST_ID]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}