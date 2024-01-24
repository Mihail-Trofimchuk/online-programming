import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { Chart } from './_components/chart';



const TestingPage = async () => {

const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }


const courseWithDetails = await db.userAnswers.findMany({
	include: {
	  test: {
		include: {
		  chapter: {
			include: {
			  course: true,
			},
		  },
		},
	  },
	  answerOption: true,
	},
  });

  if (!courseWithDetails || courseWithDetails.length === 0) {
	console.error('No user answers found.');
	return (
	  <div>
		 No such answers
	  </div>
	);
  }

  const testsForChapter = await db.test.findMany({
	where: {
	  chapterId: courseWithDetails[0].chapterId, 
	},
  });

const getUserEmail = async (userId: string) => {
	const user = await clerkClient.users.getUser(userId);
	return user.emailAddresses[0]?.emailAddress;
  };
  

  const coursePromises = courseWithDetails.map((userAnswer) => {
	
	const userEmailPromise = getUserEmail(userAnswer.userId);
	const mappedCoursePromise = userEmailPromise.then((userEmail) => ({
	  userId: userEmail,
	  question: testsForChapter.map((test) => test.question),
	  course: userAnswer.test.chapter.course.title,
	  chapter: userAnswer.test.chapter.title,
	  option: userAnswer.answerOption.map((option) => option.option).reverse(),
	  percentageCorrect: userAnswer.percentageCorrect
	}));
	return mappedCoursePromise;
  });
  
  const courses = await Promise.all(coursePromises);

  const groupedCourses: { [courseTitle: string]: { total: number; count: number } } = courseWithDetails.reduce((acc, userAnswer) => {
	const courseTitle = userAnswer.test.chapter.course.title;
	const percentageCorrect = userAnswer.percentageCorrect;
  
	if (!acc[courseTitle]) {
	  acc[courseTitle] = { total: 0, count: 0 };
	}
  
	acc[courseTitle].total += percentageCorrect;
	acc[courseTitle].count += 1;
  
	return acc;
  },  {} as { [courseTitle: string]: { total: number; count: number } });
  

  const data = Object.entries(groupedCourses).map(([courseTitle, { total, count }]) => ({
	name: courseTitle,
	total: count > 0 ? total / count : 0,
  }));

  console.log(courses);

  return ( 
    <div className="p-6">
		 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
       
      </div>
        <DataTable columns={columns} data={courses} />
		<Chart
        data={data}
        />
    </div>
   );
}
 
export default TestingPage;


