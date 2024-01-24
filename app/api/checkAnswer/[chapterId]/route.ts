import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string; } }
) {
  try {
    const { userId } = auth();
    const { selectedAnswers } = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const testsInChapter = await db.test.findMany({
    where: {
      chapterId: params.chapterId,
    },
    include: {
      answerOptions: true,
    },
  });


  // Группируем ответы по тестам
  const groupedAnswers = selectedAnswers.reduce((acc, answerId: string ) => {
    const testId = testsInChapter.find((test) =>
      test.answerOptions.some((option) => option.id === answerId)
    )?.id;

    if (testId) {
      acc[testId] = acc[testId] || [];
      acc[testId].push(answerId);
    }

    return acc;
  }, {});

  // Проверяем каждый тест отдельно
  const results = testsInChapter.map((test) => {
    const correctAnswers = test.answerOptions
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.id);

    const selectedTestAnswers = groupedAnswers[test.id] || [];

    // Проверяем, что все выбранные ответы правильные,
    // и нет ли в выборе неверных ответов
    const areAnswersCorrect =
      correctAnswers.length === selectedTestAnswers.length &&
      correctAnswers.every((correctAnswer) =>
        selectedTestAnswers.includes(correctAnswer)
      );

    return {
      testId: test.id,
      areAnswersCorrect: areAnswersCorrect,
    };
  });

  const correctAnswersCount = results.reduce((count: number, result) => {
    if (result.areAnswersCorrect) {
      return count + 1;
    }
    return count;
  }, 0);


  const percentageCorrect = (correctAnswersCount / results.length) * 100;


  console.log(results)

  const answer = await db.answerOption.findUnique({
    where: { id: selectedAnswers[0] },
    select: { testId: true },
  });

  console.log(answer?.testId);

  const answerOptions = await db.answerOption.findMany({
    where: {
      id: {
        in: selectedAnswers,
      },
    },
  });

  const existingUserAnswer = await db.userAnswers.findFirst({
    where: {
      userId: userId,
      chapterId: params.chapterId,
    },
  });

  if (existingUserAnswer) {
  
    const updatedUserAnswer = await db.userAnswers.update({
      where: {
        id: existingUserAnswer.id
      },
      data: {
        answerOption: {
          set: answerOptions.map(option => ({ id: option.id })),
        },
        percentageCorrect: percentageCorrect,
        test: { connect: { id: answer?.testId } },
      },
    });

  } else {

    const createdUserAnswer = await db.userAnswers.create({
      data: {
        userId: userId,
        chapterId: params.chapterId,
        answerOption: {
          connect: answerOptions.map(option => ({ id: option.id })),
        },
        percentageCorrect: percentageCorrect,
        test: { connect: { id: answer?.testId } }, 
      },
    }); 
  }

 

  // db.userAnswers.create({ where: {
  //   answerOptions: {
      
  //   }
  // }})

  

	const chapterOwner = await db.chapter.findUnique({
		where: {
		  id: params.chapterId,
		},
		include: {
		  test: {
			select: {
			  id: true,
			  answerOptions: {
				select: {
				  id: true,
				  isCorrect: true,
				}
			  }
			}
		  }
		}
	  });

    if (!chapterOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

	const correctAnswers = chapterOwner.test.reduce((acc: string[], currentTest) => {
		currentTest.answerOptions.forEach(answerOption => {
		  if (answerOption.isCorrect) {
			acc.push(answerOption.id);
		  }
		});
		return acc;
	  }, []);

	  const isCorrect = selectedAnswers.every((answer: string) => correctAnswers.includes(answer))

    // const testOwner = await db.test.findUnique({
    //   where: {
    //     id: params.quizId,
    //     courseId: params.courseId,
    //   }
    // });

    // if (!testOwner) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // const lastAnswer = await db.answerOption.findFirst({
    //   where: {
    //     testId: params.quizId,
    //   },
    //   orderBy: {
    //     position: "desc",
    //   },
    // });

    // const newPosition = lastAnswer ? lastAnswer.position + 1 : 1;

    // const answer = await db.answerOption.create({
    //   data: {
	// 	    option,
    //     testId: params.quizId,
    //     position: newPosition,
    //   }
    // });
	// console.log(answer);

    return NextResponse.json(results);
  } catch (error) {
    console.log("[TESTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}