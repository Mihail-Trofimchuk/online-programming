
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getFavoriteCourses } from '@/actions/get-favorite';
import { CoursesList } from "@/components/courses-list";

import { Category, Course } from '@prisma/client';

interface FavoritePageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

const FavoritePage = async ({
  searchParams
}: FavoritePageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }



  try {
    const favoriteCourses = await getFavoriteCourses({
      userId,
      ...searchParams,
    });

    return (
      <>
        <div className="p-6 space-y-4">
          <CoursesList items={favoriteCourses}  />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default FavoritePage;
