import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
 req: Request
) {
  try {
  const { userId } = auth();
  const {  testId } = await req.json();



  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }


  const test = await db.test.findFirst({
	where: {
      id: testId
	},
  }); 

    return NextResponse.json(test);
  } catch (error) {
    console.log("[TESTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}