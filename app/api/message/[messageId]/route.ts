import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.message.findUnique({
      where: {
        id: params.messageId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }


    const deletedMessage = await db.message.delete({
      where: {
        id: params.messageId,
      },
    });

    return NextResponse.json(deletedMessage);
  } catch (error) {
    console.log("[MESSAGE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}