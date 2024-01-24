import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { question } = await req.json();

    console.log(question);
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

    const lastTest = await db.test.findFirst({
      where: {
        chapterId: params.chapterId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastTest ? lastTest.position + 1 : 1;

    const test = await db.test.create({
      data: {
		question,
        chapterId: params.chapterId,
        position: newPosition,
      }
    });
	console.log(test);

    return NextResponse.json(test);
  } catch (error) {
    console.log("[TESTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}