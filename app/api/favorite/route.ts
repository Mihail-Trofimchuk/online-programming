
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getProgress } from '@/actions/get-progress';

export async function PATCH(
  req: Request,
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

	const favoriteCourses = await db.favorites.findMany({
		where: {
		  userId: userId,
		},
		include: {
		  course: {
			include: {
			  category: true,
			  chapters: {
				where: {
				  isPublished: true,
				},
				select: {
				  id: true,
				  title: true,
				  description: true,
				  isPublished: true,
				  createdAt: true,
				  updatedAt: true,
				},
			  },
			  purchases: {
				where: {
				  userId: userId,
				},
			  },
			},
		  },
		},
	  });
	
	  
	  // favoriteCourses теперь содержит все любимые курсы с подробной информацией.
	  
	
	console.log(favoriteCourses);
	
	const coursesWithProgress = await Promise.all(
		favoriteCourses.map(async (course) => {
		  if (course.course.purchases.length === 0) {
			return {
			  ...course.course,
			  progress: null,
			};
		  }
	
		  const progressPercentage = await getProgress(userId, course.course.id);
	
		  return {
			...course.course,
			progress: progressPercentage,
		  };
	
		})
	  );
	
	
    // Если курс уже в избранном, удаляем его

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}