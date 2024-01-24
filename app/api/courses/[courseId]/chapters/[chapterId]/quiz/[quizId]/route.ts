
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

	console.log(params.quizId);

    const test = await db.test.findUnique({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      }
    });

    if (!test) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // if (chapter.videoUrl) {
    //   const existingMuxData = await db.muxData.findFirst({
    //     where: {
    //       chapterId: params.chapterId,
    //     }
    //   });

    //   if (existingMuxData) {
    //     await Video.Assets.del(existingMuxData.assetId);
    //     await db.muxData.delete({
    //       where: {
    //         id: existingMuxData.id,
    //       }
    //     });
    //   }
    // }

    const deletedTest = await db.test.delete({
      where: {
        id: params.quizId
      }
    });

    const publishedTestInCourse = await db.test.findMany({
      where: {
        chapterId: params.chapterId,
        isPublished: true,
      }
    });

    if (!publishedTestInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(deletedTest);
  } catch (error) {
    console.log("[TEST_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const test = await db.test.update({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
      data: {
        ...values,
      }
    });

    // if (values.videoUrl) {
    //   const existingMuxData = await db.muxData.findFirst({
    //     where: {
    //       chapterId: params.chapterId,
    //     }
    //   });

    //   if (existingMuxData) {
    //     await Video.Assets.del(existingMuxData.assetId);
    //     await db.muxData.delete({
    //       where: {
    //         id: existingMuxData.id,
    //       }
    //     });
    //   }

    //   const asset = await Video.Assets.create({
    //     input: values.videoUrl,
    //     playback_policy: "public",
    //     test: false,
    //   });

    //   await db.muxData.create({
    //     data: {
    //       chapterId: params.chapterId,
    //       assetId: asset.id,
    //       playbackId: asset.playback_ids?.[0]?.id,
    //     }
    //   });
    // }

    return NextResponse.json(test);
  } catch (error) {
    console.log("[COURSES_TEST_ID]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}