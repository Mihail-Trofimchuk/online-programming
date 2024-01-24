import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

  
type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
};


export const getFavoriteCourses = async ({
  userId,

}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
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
	  

	console.log(favoriteCourses);

	const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
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

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
	return [];
  }
}