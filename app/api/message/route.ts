import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { name, username, education, motivation } = await req.json();

    if (!userId ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const message = await db.message.create({
      data: {
        userId,
        name,
		username,
		education,
		motivation
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
	req: Request,

  ) {
	try {
	  const { userId } = auth();
  
	  if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	  }
  
	  const message = await db.message.findFirst({
		where: {
		  userId: userId
		},
	  });
  

	  let hasMessage = false
	  if(message) {
		hasMessage = true
	  }
  
	  return NextResponse.json(hasMessage);
	} catch (error) {
	  console.log("[MESSAGE_ID_DELETE]", error);
	  return new NextResponse("Internal Error", { status: 500 });
	}
  }