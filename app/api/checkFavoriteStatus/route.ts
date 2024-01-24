import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
) {
  try {
    const { userId } = auth();
    const {  id } = await req.json();

    let response = false;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

	const favorite = await db.favorites.findFirst({
		where: {
		  userId,
		  courseId: id,
		},
	  });
    
	  const isFavorite = !!favorite;
  
 
    console.log(isFavorite);
    return NextResponse.json(isFavorite);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}