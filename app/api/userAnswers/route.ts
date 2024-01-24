import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
	const { chapterId } = await req.json();
  

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }


  const createdUserAnswer = await db.userAnswers.findFirst({
	where: {
        userId: userId,
		chapterId: chapterId,
	},
	include: {
        answerOption: true,
    },
  }); 

  console.log(createdUserAnswer);




    return NextResponse.json(createdUserAnswer);
  } catch (error) {
    console.log("[TESTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}