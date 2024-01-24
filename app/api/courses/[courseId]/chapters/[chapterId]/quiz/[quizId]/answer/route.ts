import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();
    const { option } = await req.json();

    console.log(option);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const testOwner = await db.test.findUnique({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      }
    });

    if (!testOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastAnswer = await db.answerOption.findFirst({
      where: {
        testId: params.quizId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastAnswer ? lastAnswer.position + 1 : 1;

    const answer = await db.answerOption.create({
      data: {
		    option,
        testId: params.quizId,
        position: newPosition,
      }
    });
	console.log(answer);

    return NextResponse.json(answer);
  } catch (error) {
    console.log("[TESTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}