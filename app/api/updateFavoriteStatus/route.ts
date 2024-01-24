import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
) {
  try {
    const { userId } = auth();
    const {  courseId } = await req.json();

    let response = false;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingFavorite = await db.favorites.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });
    
    // Если курс уже в избранном, удаляем его
    if (existingFavorite) {
      await db.favorites.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      
    } else {
      // В противном случае добавляем курс в избранное
      const newFavorite = await db.favorites.create({
        data: {
          userId: userId,
          courseId: courseId,
        },
      });
      response = true;
      // Используйте newFavorite по вашему усмотрению, например, для дополнительных действий или возврата результатов
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}